const utils = require("../../assets/witnet/utils/js")
const witnet = require("../../assets/witnet")

const addresses = require("../witnet/addresses")
const hashes = require("../witnet/hashes")
const templates = require("../witnet/templates")

const WitnetBytecodes = artifacts.require("WitnetBytecodes")
const WitnetRequestFactory = artifacts.require("WitnetRequestFactory")
const WitnetRequestTemplate = artifacts.require("WitnetRequestTemplate")

module.exports = async function (_deployer, network, [, from]) {
  const isDryRun = network === "test" || network.split("-")[1] === "fork" || network.split("-")[0] === "develop"
  const ecosystem = utils.getRealmNetworkFromArgs()[0]
  network = network.split("-")[0]

  if (!addresses[ecosystem]) addresses[ecosystem] = {}
  if (!addresses[ecosystem][network]) addresses[ecosystem][network] = {}
  if (!addresses[ecosystem][network].templates) addresses[ecosystem][network].templates = {}

  if (!hashes.reducers) hashes.reducers = {}
  if (!hashes.retrievals) hashes.retrievals = {}

  await deployWitnetRequestTemplates(from, isDryRun, ecosystem, network, templates) 
}

async function deployWitnetRequestTemplates (from, isDryRun, ecosystem, network, templates) {
  for (const key in templates) {
    const template = templates[key]
    if (template?.retrievals) {
      if (
        isDryRun ||
          addresses[ecosystem][network].templates[key] !== undefined
      ) {
        let templateAddr = findArtifactAddress(addresses[ecosystem][network].templates, key)
        if (
          utils.isNullAddress(templateAddr) ||
          (await web3.eth.getCode(templateAddr)).length <= 3
        ) {
          templateAddr = await deployWitnetRequestTemplate(from, key, template)
          if (utils.isNullAddress(templateAddr)) {
            throw `artifact '${key}' could not get deployed`
          }
          addresses[ecosystem][network].templates[key] = templateAddr
          utils.saveAddresses(addresses)
        }
      }
    } else {
      await deployWitnetRequestTemplates (from, isDryRun, ecosystem, network, template)
    }
  }
}

async function deployWitnetRequestTemplate (from, key, template) {
  const bytecodes = await WitnetBytecodes.deployed()
  const aggregator = await utils.verifyWitnetRadonReducerByTag(from, bytecodes, witnet?.radons, template?.aggregator)
  const tally = await utils.verifyWitnetRadonReducerByTag(from, bytecodes, witnet?.radons, template?.tally)
  const retrievals = []
  for (let i = 0; i < template.retrievals.length; i++) {
    const tag = template.retrievals[i]
    const hash = await utils.verifyWitnetRadonRetrievalByTag(from, bytecodes, witnet?.radons, tag)
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
