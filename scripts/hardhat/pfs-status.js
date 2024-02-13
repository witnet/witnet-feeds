const utils = require("../utils")

module.exports = { run };

async function run() {

    const [ pfs, ] = await utils.getWitnetPriceFeedsContract();
    
    const feeds = await pfs.supportedFeeds()
    const id4s = [], caps = [];
    const rads = feeds[2].filter((radHash, index) => {
        if (!radHash.endsWith("000000000000000000000000")) {
            id4s.push(feeds[0][index])
            caps.push(feeds[1][index])
            return true
        } else {
            return false
        }
    });

    const status = await pfs.latestPrices(id4s)
    for (const index in caps) {
        utils.traceWitnetPriceFeed(
            caps[index],
            id4s[index],
            rads[index],
            status[index][0],
            parseInt(BigInt(status[index][1]).toString()),
        );
    }
}

