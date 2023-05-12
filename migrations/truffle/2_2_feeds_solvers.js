const addresses = require("../witnet/addresses")
const solvers = require("../witnet/solvers")
const utils = require("../../assets/witnet/utils/js")

const selection = utils.getWitnetRequestArtifactsFromArgs()

const WitnetPriceFeeds = artifacts.require("WitnetPriceFeeds")

module.exports = async function (_deployer, network, [, from]) {
  const isDryRun = network === "test" || network.split("-")[1] === "fork" || network.split("-")[0] === "develop"
  const ecosystem = utils.getRealmNetworkFromArgs()[0]
  network = network.split("-")[0]

  const feeds = await WitnetPriceFeeds.deployed()
  for (const key in solvers) {
    const solverArtifact = artifacts.require(key)
    for (const caption in solvers[key]) {
      const solverName = extractKeyFromCaption(caption)
      if (isDryRun || addresses[ecosystem][network].solvers[solverName] !== undefined) {
        await settlePriceFeedSolver(
          feeds,
          from,
          caption,
          solverArtifact,
          solvers[key][caption]
        )
        addresses[ecosystem][network].solvers[solverName] = solverArtifact.address
      }
    }
    if (!isDryRun) {
      utils.saveAddresses(addresses)       
     }
  }
}

async function settlePriceFeedSolver (feeds, from, caption, solverArtifact, solverDeps) {
  if (selection.length > 0 && !checkDepsMatchSelection(solverDeps)) {
    return
  }
  console.info()
  try {
    const hash = await feeds.hash.call(caption, { from })
    const currentSolver = await feeds.lookupPriceSolver.call(hash, { from })
    let doSettlement = false
    if (
      solverArtifact.address === currentSolver[0] &&
                JSON.stringify(solverDeps) === JSON.stringify(currentSolver[1])
    ) {
      utils.traceHeader(`Skipping '${caption}':`)
    } else {
      doSettlement = true
      if (!(await feeds.supportsCaption.call(caption, { from }))) {
        utils.traceHeader(`Settling '${caption}':`)
      } else {
        utils.traceHeader(`Revisiting '${caption}':`)
      }
      console.info("  ", "> Routed feed ID4:           ", hash)
      console.info("  ", "> Routed feed solver deps:   ", solverDeps)
    }
    if (doSettlement) {
      console.info("  ", "> Routed feed solver address:", `${currentSolver[0]} => ${solverArtifact.address}`)
      const tx = await feeds.settleFeedSolver(
        caption,
        solverArtifact.address,
        solverDeps,
        { from }
      )
      traceTx(tx.receipt)
    } else {
      console.info("  ", "> Routed feed solver address:", solverArtifact.address)
    }
  } catch (ex) {
    utils.traceHeader(`Failed '${caption}:`)
    console.info("  ", unescape(ex))
    process.exit(1)
  }
}

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toUpperCase() : word.toLowerCase();
  }).replace(/\s+/g, '');
}

function checkDepsMatchSelection(deps) {
  let match = true
  deps.map(caption => {
    const key = extractKeyFromCaption(caption)
    if (!selection.includes(key)) {
      match = false
    }
  })
  return match
}

function extractKeyFromCaption (caption) {
  let parts = caption.split("-")
  const decimals = parts[parts.length - 1]
  parts = parts[1].split("/")
  return `WitnetPriceSolver${camelize(parts[0])}${camelize(parts[1])}${decimals}`
}

function traceTx (receipt) {
  console.log("  ", "> Block number:     ", receipt.blockNumber)
  console.log("  ", "> Transaction hash: ", receipt.transactionHash)
  console.log("  ", "> Transaction gas:  ", receipt.gasUsed)
}
