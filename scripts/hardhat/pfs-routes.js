const utils = require("../utils")

module.exports = { run };

async function run() {

    const [ pfs, ] = await utils.getWitnetPriceFeedsContract();
    
    const feeds = await pfs.supportedFeeds()
    const id4s = [], caps = [];
    feeds[2].filter((radHash, index) => {
        if (radHash.endsWith("000000000000000000000000")) {
            id4s.push(feeds[0][index])
            caps.push(feeds[1][index])
            return true
        } else {
            return false
        }
    });

    const status = await pfs.latestPrices(id4s)
    for (const index in caps) {
        const solver = await pfs.lookupPriceSolver(id4s[index])
        const solverAddr = solver[0]
        const solverDeps = solver[1]
        const solverContract = await utils.getWitnetPriceSolverContract(solverAddr)
        const solverClass = await solverContract.class()
        utils.traceWitnetPriceRoute(
            caps[index],
            id4s[index],
            solverAddr,
            solverClass,
            solverDeps,
            status[index][0],
            parseInt(BigInt(status[index][1]).toString()),
        );
    }
}

