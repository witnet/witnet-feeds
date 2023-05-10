const addresses = require("../witnet/addresses")
const solvers = require("../witnet/solvers")
const utils = require("../../assets/witnet/utils/js")

const WitnetPriceFeeds = artifacts.require("WitnetPriceFeeds")

module.exports = async function (_deployer, network, [, from]) {
    const ecosystem = utils.getRealmNetworkFromArgs()[0]
    network = network.split("-")[0]

    const feeds = await WitnetPriceFeeds.deployed()
    for (const key in solvers) {
        const solverArtifact = artifacts.require(key)
        for (const caption in solvers[key]) {
            const key = extractKeyFromCaption(caption)
            console.log(caption, "=>", key)
            if (addresses[ecosystem][network].solvers[key] !== undefined) {
                await settlePriceFeedSolver(
                    feeds,
                    from,
                    caption,
                    solverArtifact,
                    solvers[key][caption]
                )
            }
        }
    }
}

async function settlePriceFeedSolver(feeds, from, caption, solverArtifact, solverDeps) {
    console.info()
    try {
        const hash = await feeds.hash.call(caption, { from })    
        const solver = await solverArtifact.deployed()
        const currentSolver = await feeds.lookupPriceSolver.call(hash, {from})
        let doSettlement = false
        if (
            solver.address === currentSolver[0]
                && JSON.stringify(solverDeps) === JSON.stringify(currentSolver[1])
        ) {
            utils.traceHeader(`Skipping '${key}':`)
        } else {
            doSettlement = true
            if (!(await feeds.supportsCaption.call(caption, {from}))) {
                utils.traceHeader(`Settling '${key}':`)
            } else {
                utils.traceHeader(`Revisiting '${key}':`)
            }
            console.info("  ", "> Routed feed id:            ", hash)
            console.info("  ", "> Routed feed solver address:", solver.address)
            console.info("  ", "> Routed feed solver deps   :", solverDeps)
            var tx = await feeds.settleFeedSolver(
                caption,
                addresses[key],
                { from }
            )
            traceTx(tx.receipt)
        }
    } catch (ex) {
        utils.traceHeader(`Failed '${caption}:`)
        console.info("   > Exception:", ex)
    }
}

function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }

function extractKeyFromCaption(caption) {
    let parts = caption.split("-")
    const decimals = parts[parts.length - 1]
    parts = parts.split("/")
    return `WitnetPriceSolver${camelize(parts[0])}${camelize(parts[1])}${decimals}`
}

function extractCaptionFromKey(key) {
    var decimals = key.match(/\d+$/)[0]
    var camels = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, function(str){ return str.toUpperCase(); })
        .split(" ")
    return `Price-${camels[camels.length - 2].toUpperCase()}/${camels[camels.length - 1].replace(/\d$/, '').toUpperCase()}-${decimals}`
}

function traceTx(receipt) {
    console.log("  ", "> Block number:     ", receipt.blockNumber)
    console.log("  ", "> Transaction hash: ", receipt.transactionHash)
    console.log("  ", "> Transaction gas:  ", receipt.gasUsed)
}