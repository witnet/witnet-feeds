const hre = require("hardhat")
const { utils } = require("witnet-solidity")
const assets = require("../../witnet/assets")
const network = hre.network.name
const helpers = require("../utils")

module.exports = { run }

async function run (args) {
  const selection = args.captions?.map(caption => {
    return "Price-" + caption.toUpperCase()
  }) || []

  const [pfs] = await helpers.getWitPriceFeedsContract(args?.from)

  await dryRunPriceFeeds(pfs, selection, args?.trace)
  console.info()
}

async function dryRunPriceFeeds (pfs, selection, verbose) {
  const addresses = assets.getNetworkAddresses(network)?.requests
  const prices = Object.fromEntries(
    helpers.flattenRadonAssets(assets.legacy.requests.DeFi["price-feeds"])
      .map(value => [value.key, value.artifact])
  )
  for (const key in prices) {
    const caption = helpers.extractErc2362CaptionFromKey("Price", key)
    try {
      if (
        !caption ||
          (selection.length === 0 && helpers.isNullAddress(addresses[key])) ||
          (selection.length > 0 && !selection.includes(caption))
      ) {
        continue
      }
      if (helpers.isNullAddress(addresses[key])) {
        throw "Not deployed."
      }
      const hash = await pfs.hash(caption)
      const request = await helpers.getWitOracleRequestContract(addresses[key])
      const requestClass = await request.class()
      const requestSpecs = await request.specs()
      if (requestSpecs !== "0xd210485c") {
        throw `Uncompliant request at ${addresses[key]}`
      }
      const bytecode = await request.bytecode()
      if (await pfs.supportsCaption(caption)) {
        console.info()
        console.info("  ", `\x1b[1;94m${caption}\x1b[0m`)
        console.info("  ", `> ID4 hash:          \x1b[1;34m${hash}\x1b[0m`)
        console.info("  ", `> Request address:   \x1b[96m${addresses[key]}\x1b[0m`)
        console.info("  ", `> Request artifact:  \x1b[1;37m${key}\x1b[0m`)
        console.info("  ", `> Request factory:   \x1b[90m${requestClass}\x1b[0m`)
        var report = await utils.radon.execRadonBytecode(
          bytecode, 
          // "--headline", `"${hre.network.name.toUpperCase()}::${caption}"`,
          "--indent", `3`,
          ...(verbose ? ["--verbose"] : []), 
        )
        console.info(report)
      } 
    } catch (ex) {
      console.info()
      console.info("  ", `\x1b[1;31m${caption}\x1b[0m`)
      console.info("  ", "=".repeat(caption.length))
      console.info("  ", `> ${ex}`)
    }
  }
};
