const utils = require("../../assets/witnet/utils/js")

const addresses = require("../witnet/addresses")
const solvers = require("../witnet/solvers")

const WitnetPriceFeeds = artifacts.require("WitnetPriceFeeds")

module.exports = async function (deployer, network, [, from]) {
  const isDryRun = network === "test" || network.split("-")[1] === "fork" || network.split("-")[0] === "develop"
  const ecosystem = utils.getRealmNetworkFromArgs()[0]
  network = network.split("-")[0]

  if (!addresses[ecosystem]) addresses[ecosystem] = {};
  if (!addresses[ecosystem][network]) addresses[ecosystem][network] = {};
  if (!addresses[ecosystem][network].solvers) addresses[ecosystem][network].solvers = {};

  await deployWitnetSolvers(deployer, from, isDryRun, ecosystem, network, solvers)
}

async function deployWitnetSolvers(deployer, from, isDryRun, ecosystem, network, solvers) {
  for (const key in solvers) {
    const solver = solvers[key]
    if (solver?.artifact) {
      var targetAddress = addresses[ecosystem][network].solvers[key]
      if (
        isDryRun
          || (targetAddress !== undefined && utils.isNullAddress(targetAddress))
        ) {
        try {
          targetAddress = await deployWitnetSolver(deployer, from, key, solver)
          addresses[ecosystem][network].solvers[key] = targetAddress
          utils.saveAddresses(addresses)
        } catch (e) {
          utils.traceHeader(`Failed '${key}': ${e}`)
          process.exit(1)
        }
      } else if (!utils.isNullAddress(targetAddress)) {
        utils.traceHeader(`Skipping '${key}': deployed at '${targetAddress}'`)
        const artifact = artifacts.require(solver.artifact)
        artifact.address = targetAddress
      }
    } else {
      await deployWitnetSolvers(
        deployer,
        from,
        isDryRun,
        ecosystem,
        network,
        solver
      )
    }
  }
}

async function deployWitnetSolver(deployer, from, key, solver) {
  const feeds = await WitnetPriceFeeds.deployed()
  const artifact = await artifacts.require(solver.artifact)
  var decimals = key.match(/\d+$/)[0]
  var caption = extractCaptionFromKey(key)
  var deps = []
  for (var j = 0; j < solver.deps.length; j ++) {
    deps.push(await feeds.hash.call(solver.deps[j], { from }))
  }
  await deployer.deploy(artifact, decimals, deps, { from })
  var contract = await artifact.deployed()
  console.info("  ", "> solver caption:     ", `'${caption}'`)
  console.info("  ", "> solver class:       ", await contract.class.call({ from }))
  console.info("  ", "> solver deps:        ", await contract.deps.call({ from }))
  console.info("  ", "> solver derivatives: ", solver.deps)
  return artifact.address
}

function extractCaptionFromKey(key) {
  var decimals = key.match(/\d+$/)[0]
  var camels = key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, function(str){ return str.toUpperCase(); })
    .split(" ")
  return `Price-${camels[camels.length - 2].toUpperCase()}/${camels[camels.length - 1].replace(/\d$/, '').toUpperCase()}-${decimals}`
}