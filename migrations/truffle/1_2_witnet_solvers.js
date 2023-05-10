const addresses = require("../witnet/addresses")
const solvers = require("../witnet/solvers")
const utils = require("../../assets/witnet/utils/js")

const WitnetPriceFeeds = artifacts.require("WitnetPriceFeeds")

module.exports = async function (deployer, network, [, from]) {
  const isDryRun = network === "test" || network.split("-")[1] === "fork" || network.split("-")[0] === "develop"
  const ecosystem = utils.getRealmNetworkFromArgs()[0]
  network = network.split("-")[0]

  if (!addresses[ecosystem]) addresses[ecosystem] = {};
  if (!addresses[ecosystem][network]) addresses[ecosystem][network] = {};
  if (!addresses[ecosystem][network].solvers) addresses[ecosystem][network].solvers = {};

  for (key in solvers) {
    await deployWitnetPriceSolver(deployer, from, isDryRun, ecosystem, network, key)
  }
}

async function deployWitnetPriceSolver(deployer, from, isDryRun, ecosystem, network, key) {
  if (isDryRun || utils.isNullAddress(addresses[ecosystem][network].solvers[key])) {
    const artifact = artifacts.require(key)
    await deployer.deploy(artifact, WitnetPriceFeeds.address, { from })
    addresses[ecosystem][network].solvers[key] = artifact.address
    if (!isDryRun) {
      utils.saveAddresses(addresses)
    }
  } else {
    artifact.address = addresses[ecosystem][network].solvers[key]
    utils.traceHeader(`Skipping '${key}': deployed at ${artifact.address}`)
  }
}
