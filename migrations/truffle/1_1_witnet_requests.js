const utils = require("../../assets/witnet/utils/js")
const witnet = require("../../assets/witnet")

const addresses = require("../witnet/addresses")
const hashes = require("../witnet/hashes")
const requests = require("../witnet/requests")

const selection = utils.getWitnetRequestArtifactsFromArgs()

const WitnetBytecodes = artifacts.require("WitnetBytecodes")
const WitnetRequest = artifacts.require("WitnetRequest")
const WitnetRequestFactory = artifacts.require("WitnetRequestFactory")
const WitnetRequestTemplate = artifacts.require("WitnetRequestTemplate")

module.exports = async function (_deployer, network, [, from]) {
  const isDryRun = network === "test" || network.split("-")[1] === "fork" || network.split("-")[0] === "develop"
  const ecosystem = utils.getRealmNetworkFromArgs()[0]
  network = network.split("-")[0]

  if (!addresses[ecosystem]) addresses[ecosystem] = {}
  if (!addresses[ecosystem][network]) addresses[ecosystem][network] = {}
  if (!addresses[ecosystem][network].requests) addresses[ecosystem][network].requests = {}
  if (!addresses[ecosystem][network].templates) addresses[ecosystem][network].templates = {}

  if (!hashes.reducers) hashes.reducers = {}
  if (!hashes.retrievals) hashes.retrievals = {}

  await deployWitnetRequests(from, isDryRun, ecosystem, network, requests)
}

async function deployWitnetRequests (from, isDryRun, ecosystem, network, requests) {
  for (const key in requests) {
    const request = requests[key]
    if (request?.retrievals || request?.template) {
      const targetAddress = addresses[ecosystem][network].requests[key] ?? null
      if (selection.length == 0 || selection.includes(key)) {
        if (isDryRun || targetAddress === "") {
          let requestAddress
          if (request?.retrievals) {
            try {
              requestAddress = await deployWitnetRequest(from, key, request)
            } catch (e) {
              utils.traceHeader(`Failed '${key}': ${e}`)
              process.exit(1)
            }
          } else {
            try {
              let templateAddr = findArtifactAddress(addresses[ecosystem][network], request?.template)
              if (
                utils.isNullAddress(templateAddr) ||
                  (await web3.eth.getCode(templateAddr)).length <= 3
              ) {
                const templateArtifact = findTemplateArtifact(witnet.templates, request?.template)
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
              console.info("  ", "> Template artifact:", request?.template)
              console.info("  ", "> Template address: ", templateAddr)
              const contract = await WitnetRequestTemplate.at(templateAddr)
              const args = request?.args
              args.map((subargs, source) => {
                if (!Array.isArray(subargs)) {
                  args[source] = Object.values(subargs)
                }
                console.info("  ", `> Template source #${source + 1} params => ${JSON.stringify(args[source])}`)
                return subargs
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

async function deployWitnetRequest (from, key, request) {
  const registry = await WitnetBytecodes.deployed()
  const aggregator = await utils.verifyWitnetRadonReducerByTag(from, registry, witnet.radons, request.aggregator)
  const tally = await utils.verifyWitnetRadonReducerByTag(from, registry, witnet.radons, request.tally)
  const tags = Object.keys(request?.retrievals)
  const retrievals = []
  for (let i = 0; i < tags?.length; i++) {
    const hash = await utils.verifyWitnetRadonRetrievalByTag(from, registry, witnet.radons, tags[i])
    hashes.retrievals[tags[i]] = hash
    retrievals.push(hash)
  }
  hashes.reducers[request.aggregator] = aggregator
  hashes.reducers[request.tally] = tally
  utils.saveHashes(hashes)

  utils.traceHeader(`Building '${key}'...`)
  const factory = await WitnetRequestFactory.deployed()
  let templateAddr = await factory.buildRequestTemplate.call(
    retrievals,
    aggregator,
    tally,
    request?.resultDataMaxSize || 0,
    { from }
  )
  if (
    utils.isNullAddress(templateAddr) ||
      (await web3.eth.getCode(templateAddr)).length <= 3
  ) {
    const tx = await factory.buildRequestTemplate(
      retrievals,
      aggregator,
      tally,
      request?.resultDataMaxSize || 0,
      { from }
    )
    tx.logs = tx.logs.filter(log => log.event === "WitnetRequestTemplateBuilt")
    utils.traceTx(tx.receipt)
    templateAddr = tx.logs[0].args.template
  }
  console.info("  ", "> Template address:", templateAddr)
  const contract = await WitnetRequestTemplate.at(templateAddr)
  console.info("  ", "> Customizing Radon Retrievals...")
  const args = Object.entries(request?.retrievals).map(entry => {
    let subargs = entry[1]
    if (!Array.isArray(subargs)) {
      subargs = Object.values(subargs)
    }
    console.info("  ", `  => <${subargs.map(v => `"${v}"`)}> from ['${entry[0]}']`)
    return subargs
  })
  return utils.buildWitnetRequestFromTemplate(from, contract, args)
}

async function deployWitnetRequestTemplate (from, key, template) {
  const registry = await WitnetBytecodes.deployed()
  const aggregator = await utils.verifyWitnetRadonReducerByTag(from, registry, witnet.radons, template.aggregator)
  const tally = await utils.verifyWitnetRadonReducerByTag(from, registry, witnet.radons, template.tally)
  const retrievals = []
  for (let i = 0; i < template.retrievals.length; i++) {
    const tag = template.retrievals[i]
    const hash = await utils.verifyWitnetRadonRetrievalByTag(from, registry, witnet.radons, tag)
    hashes.retrievals[tag] = hash
    retrievals.push(hash)
  }
  hashes.reducers[template.aggregator] = aggregator
  hashes.reducers[template.tally] = tally
  utils.saveHashes(hashes)

  utils.traceHeader(`Building '${key}'...`)
  const factory = await WitnetRequestFactory.deployed()
  let templateAddr = await factory.buildRequestTemplate.call(
    retrievals,
    aggregator,
    tally,
    template?.resultDataMaxSize || 0,
    { from }
  )
  if (
    utils.isNullAddress(templateAddr) ||
      (await web3.eth.getCode(templateAddr)).length <= 3
  ) {
    const tx = await factory.buildRequestTemplate(
      retrievals,
      aggregator,
      tally,
      template?.resultDataMaxSize || 0,
      { from }
    )
    utils.traceTx(tx.receipt)
    tx.logs = tx.logs.filter(log => log.event === "WitnetRequestTemplateBuilt")
    templateAddr = tx.logs[0].args.template
    if (!tx.logs[0].args.parameterized) {
      // settle as a WitnetRequest if retrievals require no params
      const args = []
      for (let i = 0; i < retrievals?.length; i++) {
        args.push([])
      }
      const tx = await contract.buildRequest(args, { from })
      tx.logs = tx.logs.filter(log => log.event === "WitnetRequestBuilt")
      console.debug("  ", "> No-args settlement hash:", tx.receipt.transactionHash)
      console.debug("  ", "> No-args settlement gas: ", tx.receipt.gasUsed)
      console.info("  ", "> Request data type:", utils.getRequestResultDataTypeString(await contract.resultDataType.call()))
      console.info("  ", "> Request address:  ", tx.logs[0].args.request)
      console.info("  ", "> Request RAD hash: ", tx.logs[0].args.radHash)
    }
  }
  const templateContract = await WitnetRequestTemplate.at(templateAddr)
  console.info("  ", "> Template address: ", templateContract.address)
  console.info("  ", "> Template registry:", await templateContract.registry.call())
  return templateAddr
}

function findTemplateArtifact (templates, artifact) {
  if (typeof templates === "object") {
    for (const key in templates) {
      if (key === artifact) {
        return templates[key]
      }
      if (typeof templates[key] === "object") {
        const template = findTemplateArtifact(templates[key], artifact)
        if (template !== "") return template
      }
    }
  }
  return ""
}

function findArtifactAddress (addresses, artifact) {
  if (typeof addresses === "object") {
    for (const key in addresses) {
      if (key === artifact) {
        return addresses[key]
      }
      if (typeof addresses[key] === "object") {
        const address = findArtifactAddress(addresses[key], artifact)
        if (address !== "") return address
      }
    }
  }
  return ""
}
