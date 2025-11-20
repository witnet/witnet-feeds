const { assets, utils, Rulebook } = require("../dist/src/lib");

const rulebook = Rulebook.default()

let errors = 0, requests = 0
const priceFeeds = rulebook.getNetworkPriceFeeds();
const maxCaptionWidth = Math.max(...priceFeeds.requests.map(caption => caption.length))

priceFeeds.requests
    .sort()
    .filter((caption, index) => priceFeeds.requests.indexOf(caption) === index)
    .forEach((caption) => {
        const artifact = utils.captionToWitOracleRequestPrice(caption);
        let request;
        try {
            request = utils.requireRadonRequest(artifact, assets);
            console.info(
                `✅ ${caption}${" ".repeat(maxCaptionWidth - caption.length)} => [${request.radHash}] (${request.sources.length}) ${artifact}`
            )
            requests += 1
        } catch (err) {
            console.error(
                `❌ ${caption}${" ".repeat(maxCaptionWidth - caption.length)} => ${err}`,
            );
            errors += 1
        }
        rulebook.getPriceFeedUpdateConditions(caption, true)
        rulebook.getPriceFeedUpdateConditions(caption, false)
    });

console.info("-".repeat(135))
if (errors) {
    console.error(`^ Total errors: ${errors}`)
    process.exit(1);
} else {
    console.error(`^ Total requests: ${requests}`)
    process.exit(1);
}
