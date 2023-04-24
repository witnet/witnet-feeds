const utils = require("../../assets/witnet/utils/js")
const witnet = require("../../assets/witnet")

const addresses = require("../witnet/addresses")
const hashes = require("../witnet/hashes")
const requests = require("../witnet/requests")

const WitnetBytecodes = artifacts.require("WitnetBytecodes")
const WitnetRequestFactory = artifacts.require("WitnetRequestFactory")
const WitnetRequestTemplate = artifacts.require("WitnetRequestTemplate")

module.exports = async function (_deployer, network, [, from]) {
  const isDryRun = network === "test" || network.split("-")[1] === "fork" || network.split("-")[0] === "develop"
  const ecosystem = utils.getRealmNetworkFromArgs()[0]
  network = network.split("-")[0]

  if (!addresses[ecosystem]) addresses[ecosystem] = {};
  if (!addresses[ecosystem][network]) addresses[ecosystem][network] = {};
  if (!addresses[ecosystem][network].requests) addresses[ecosystem][network].requests = {};
  if (!addresses[ecosystem][network].templates) addresses[ecosystem][network].templates = {};

  if (!hashes.reducers) hashes.reducers = {}
  if (!hashes.retrievals) hashes.retrievals = {}

  await deployWitnetRequests(from, isDryRun, ecosystem, network, requests)
}

async function deployWitnetRequests(from, isDryRun, ecosystem, network, requests) {
  for (const key in requests) {
    const request = requests[key]
    if (request?.retrievals || request?.template) {
      var targetAddress = addresses[ecosystem][network].requests[key] ?? null
      if (isDryRun || targetAddress === "") {
        var requestAddress
        if (request?.retrievals) {
          try {
            requestAddress = await deployWitnetRequest(from, key, request)
          } catch (e) {
            utils.traceHeader(`Failed '${key}': ${e}`)
            process.exit(1)
          }
        } else {
          try {
            var templateAddr = findArtifactAddress(addresses, request?.template)
            if (
              utils.isNullAddress(templateAddr)
                || (await web3.eth.getCode(templateAddr)).length <= 3
            ) {
              var templateArtifact = findTemplateArtifact(witnet.templates, request?.template)
              if (!templateArtifact) {
                throw `artifact '${request?.template} not found in templates file`
              }
              templateAddr = await deployWitnetRequestTemplate(from, request?.template, templateArtifact)
              if (utils.isNullAddress(templateAddr)) {
                throw `artifact '${request?.template}' could not get deployed`
              }
              addresses[ecosystem][network].templates[request?.template] = templateAddr
            }
            utils.traceHeader(`Settling '${key}'...`)
            console.info("  ", "> template artifact:", request?.template)
            console.info("  ", "> template address: ", templateAddr)
            var contract = await WitnetRequestTemplate.at(templateAddr)
            var args = request?.args
            args.map((subargs, source) => {
              if (!Array.isArray(subargs)) {
                args[source] = Object.values(subargs)
              }
              console.info("  ", `> template source #${source+1} params => ${JSON.stringify(args[source])}`)
            })
            requestAddress = await utils.buildWitnetRequestFromTemplate(from, contract, request?.args)
          } catch (ex) {
            utils.traceHeader(`Failed '${key}': ${ex}`)
            process.exit(1)
          }
        }
        addresses[ecosystem][network].requests[key] = requestAddress
        utils.saveAddresses(addresses)
      } else if (!utils.isNullAddress(targetAddress)) {
        utils.traceHeader(`Skipping '${key}': deployed at '${targetAddress}'`)
      }
    } else {
      await deployWitnetRequests(
        from,
        isDryRun,
        ecosystem,
        network,
        request
      )
    }
  }
}

async function deployWitnetRequest(from, key, request) {
  var registry = await WitnetBytecodes.deployed()
  var aggregator = await utils.verifyWitnetRadonReducerByTag(from, registry, witnet.radons, request.aggregator)
  var tally = await utils.verifyWitnetRadonReducerByTag(from, registry, witnet.radons, request.tally)
  var tags = Object.keys(request?.retrievals)
  var retrievals = []
  for (var i = 0; i < tags?.length; i ++) {
    var hash = await utils.verifyWitnetRadonRetrievalByTag(from, registry, witnet.radons, tags[i])
    hashes.retrievals[tags[i]] = hash
    retrievals.push(hash)
  }
  hashes.reducers[request.aggregator] = aggregator
  hashes.reducers[request.tally] = tally
  utils.saveHashes(hashes)
  
  utils.traceHeader(`Building '${key}'...`)
  var factory = await WitnetRequestFactory.deployed()
  var templateAddr = await factory.buildRequestTemplate.call(
    retrievals,
    aggregator,
    tally,
    request?.resultDataMaxSize || 0,
    { from }
  )
  if (
    utils.isNullAddress(templateAddr)
      || (await web3.eth.getCode(templateAddr)).length <= 3
  ) {
    var tx = await factory.buildRequestTemplate(
      retrievals,
      aggregator,
      tally,
      request?.resultDataMaxSize || 0,
      { from }
    )
    tx.logs = tx.logs.filter(log => log.event === 'WitnetRequestTemplateBuilt')
    templateAddr = tx.logs[0].args.template
    console.info("  ", "> transaction hash:", tx.receipt.transactionHash)
    console.info("  ", "> transaction gas: ", tx.receipt.gasUsed)
  }
  console.info("  ", "> template address:", templateAddr)
  var contract = await WitnetRequestTemplate.at(templateAddr)
  console.info("  ", "> request retrievals...")
  var args = Object.entries(request?.retrievals).map(entry => {
    var subargs = entry[1]
    if (!Array.isArray(subargs)) {
      subargs = Object.values(subargs)
    }
    console.info("  ", `  => <${subargs.map(v => `"${v}"`)}> from ['${entry[0]}']`)
    return subargs
  })
  return utils.buildWitnetRequestFromTemplate(from, contract, args)
}

async function deployWitnetRequestTemplate(from, key, template) {
  var registry = await WitnetBytecodes.deployed()
  var aggregator = await utils.verifyWitnetRadonReducerByTag(from, registry, witnet.radons, template.aggregator)
  var tally = await utils.verifyWitnetRadonReducerByTag(from, registry, witnet.radons, template.tally)
  var retrievals = []
  for (var i = 0; i < template.retrievals.length; i ++) {
    var tag = template.retrievals[i]
    var hash = await utils.verifyWitnetRadonRetrievalByTag(from, registry, witnet.radons, tag)
    hashes.retrievals[tag] = hash
    retrievals.push(hash)
  }
  hashes.reducers[template.aggregator] = aggregator
  hashes.reducers[template.tally] = tally
  utils.saveHashes(hashes)

  utils.traceHeader(`Building '${key}'...`)
  var factory = await WitnetRequestFactory.deployed()
  var templateAddr = await factory.buildRequestTemplate.call(
    retrievals,
    aggregator,
    tally,
    template?.resultDataMaxSize || 0,
    { from }
  )
  if (
    utils.isNullAddress(templateAddr)
      || (await web3.eth.getCode(templateAddr)).length <= 3
  ) {
    var tx = await factory.buildRequestTemplate(
      retrievals,
      aggregator,
      tally,
      template?.resultDataMaxSize || 0,
      { from }
    )
    tx.logs = tx.logs.filter(log => log.event === 'WitnetRequestTemplateBuilt')
    templateAddr = tx.logs[0].args.template
    console.info("  ", "> transaction hash:", tx.receipt.transactionHash)
    console.info("  ", "> transaction gas: ", tx.receipt.gasUsed)
    if (!tx.logs[0].args.parameterized) {
      // settle as a WitnetRequest if retrievals require no params
      var args = []
      for (var i = 0; i < retrievals?.length; i ++) {
        args.push([])
      }
      var tx = await contract.buildRequest(args, { from })
      tx.logs = tx.logs.filter(log => log.event === 'WitnetRequestBuilt')
      console.debug("  ", "> no-args settlement hash:", tx.receipt.transactionHash)
      console.debug("  ", "> no-args settlement gas: ", tx.receipt.gasUsed)    
      console.info("  ", "> request address:  ", tx.logs[0].args.request)
      console.info("  ", "> request radhash:  ", tx.logs[0].args.radHash)
      console.info("  ", "> request data type:", await contr)
    }
  }
  console.info("  ", "> template address:", templateAddr)
  return templateAddr
}

function findTemplateArtifact(templates, artifact) {
  if (typeof templates === 'object') {
    for (const key in templates) {
      if (key === artifact) {
        return templates[key]
      } 
      if (typeof templates[key] === 'object') {
        var template = findTemplateArtifact(templates[key], artifact)
        if (template !== "") return template;
      }
    }
  }
  return ""
}

function findArtifactAddress(addresses, artifact) {
  if (typeof addresses === 'object') {
    for (const key in addresses) {
      if (key === artifact) {
        return addresses[key]
      } 
      if (typeof addresses[key] === 'object') {
        var address = findArtifactAddress(addresses[key], artifact)
        if (address !== "") return address;
      }
    }
  }
  return ""
}