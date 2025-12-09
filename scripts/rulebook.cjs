const { assets, utils, Rulebook } = require("../dist/src/lib");

const rulebook = Rulebook.default()

let errors = 0, requests = 0
const priceFeeds = rulebook.getNetworkPriceFeeds();
const maxCaptionWidth = Math.max(...Object.keys(priceFeeds.oracles).map(caption => caption.length))

Object.entries(priceFeeds.oracles)
    .sort(([a], [b]) => a.localeCompare(b))
    .filter(([, oracle]) => (
        oracle.class === "witnet" && oracle.target === undefined
    ))
    .forEach(([caption, oracle]) => {
        const artifact = oracle?.sources ?? utils.captionToWitOracleRequestPrice(caption);
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
}
