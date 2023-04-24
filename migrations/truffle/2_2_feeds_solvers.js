const addresses = require("../witnet/addresses")
const utils = require("../../assets/witnet/utils/js")

const WitnetPriceFeeds = artifacts.require("WitnetPriceFeeds")
const WitnetPriceSolver = artifacts.require("WitnetPriceSolverBase")

module.exports = async function (_deployer, network, [, from]) {
    const ecosystem = utils.getRealmNetworkFromArgs()[0]
    network = network.split("-")[0]
    await settlePriceFeedsSolver(from, addresses[ecosystem][network].solvers)
}

async function settlePriceFeedsSolver(from, addresses) {
    const feeds = await WitnetPriceFeeds.deployed()
    for (const key in addresses) {
        console.info()
        var caption = extractCaptionFromKey(key)
        var hash = await feeds.hash.call(caption, { from })
        try {
            var solver = await WitnetPriceSolver.at(addresses[key])
            if ((await web3.eth.getCode(solver.address)).length > 2) {
                var solverClass = await solver.class.call({ from })
                if (solverClass !== "0x70a91957") {
                    throw `contract at ${addresses[key]} not of the WitnetPriceSolver kind.`
                }
                var solverCurrentAddress = await feeds.lookupPriceSolver.call(hash, {from})
                if (solver.address === solverCurrentAddress) {
                    utils.traceHeader(`Skipping '${key}': already settled to '${caption}' as ${solver.address}`)
                } else {
                    if (!(await feeds.supportsCaption.call(caption, {from}))) {
                        utils.traceHeader(`Settling '${key}':`)
                        
                    } else {
                        utils.traceHeader(`Revisiting '${key}':`)
                    }
                    console.info("  ", "> Routed feed id:            ", hash)
                    console.info("  ", "> Routed feed caption:       ", caption)
                    console.info("  ", "> Routed feed solver address:", solver.address)
                    var deps = await solver.deps.call({from})
                    var innerCaptions = []
                    for (var j = 0; j < deps.length; j ++) {
                        var innerCaption = await feeds.lookupCaption.call(deps[j], {from})
                        if (
                            innerCaption === ""
                                || !(await feeds.supportsCaption.call(innerCaption, {from}))
                        ) {
                            throw `relies on feed '${deps[j]}' which is not currently supported on ${feeds.address}`
                        }
                        innerCaptions.push(innerCaption)
                    }
                    console.info("  ", "> Routed feed solver deps:   ", innerCaptions)
                    var tx = await feeds.settleFeedSolver(
                        caption,
                        addresses[key],
                        { from }
                    )
                    traceTx(tx.receipt)
                }
            } else {
                utils.traceHeader(`Skipping '${key}': no code at ${addresses[key]}.`)
            }
        } catch (ex) {
            console.info(`Couldn't handle '${key}': ${ex}`)
            process.exit(1)
        }
    }
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
    console.log("  ", "> block number:     ", receipt.blockNumber)
    console.log("  ", "> transaction hash: ", receipt.transactionHash)
    console.log("  ", "> transaction gas:  ", receipt.gasUsed)
}