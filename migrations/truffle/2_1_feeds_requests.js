const addresses = require("../witnet/addresses")
const utils = require("../../assets/witnet/utils/js")

const WitnetPriceFeeds = artifacts.require("WitnetPriceFeeds")
const WitnetRequest = artifacts.require("WitnetRequest")

module.exports = async function (_deployer, network, [, from]) {
  const ecosystem = utils.getRealmNetworkFromArgs()[0]
  network = network.split("-")[0]
  await settlePriceFeedsRadHash(from, addresses[ecosystem][network].requests)
}

async function settlePriceFeedsRadHash (from, addresses) {
  const feeds = await WitnetPriceFeeds.deployed()
  for (const key in addresses) {
    try {
      if (utils.isNullAddress(addresses[key])) {
        throw "no address."
      }
      const caption = extractCaptionFromKey(key)
      const hash = await feeds.hash.call(caption, { from })
      const request = await WitnetRequest.at(addresses[key])
      if ((await web3.eth.getCode(request.address)).length > 2) {
        const requestClass = await request.class.call({ from })
        if (requestClass !== "0xcfcd3875") {
          throw `contract at ${addresses[key]} not of the WitnetRequest kind.`
        }
        const radHash = await request.radHash.call({ from })
        if (!(await feeds.supportsCaption.call(caption, { from }))) {
          utils.traceHeader(`Settling '${caption}':`)
          console.info("  ", "> ID4 hash:         ", hash)
          console.info("  ", "> Request data type:", utils.getRequestResultDataTypeString(await request.resultDataType.call()))
          console.info("  ", "> Request artifact: ", key)
          console.info("  ", "> Request address:  ", request.address)
          console.info("  ", "> Request registry: ", await request.registry.call())
          console.info("  ", "> Request RAD hash: ", radHash)
          const tx = await feeds.methods["settleFeedRequest(string,bytes32)"](
            caption,
            radHash,
            { from }
          )
          utils.traceTx(tx.receipt)
        } else {
          const currentRadHash = await feeds.lookupRadHash.call(hash, { from })
          if (radHash !== currentRadHash) {
            utils.traceHeader(`Revisiting '${caption}':`)
            console.info("  ", "> ID4 hash:            ", hash)
            console.info("  ", "> Request data type:   ", utils.getRequestResultDataTypeString(await request.resultDataType.call()))
            console.info("  ", "> Request artifact:    ", key)
            console.info("  ", "> NEW request address: ", request.address)
            console.info("  ", "> NEW request RAD hash:", radHash)
            console.info("  ", "> OLD request RAD hash:", currentRadHash)
            const tx = await feeds.methods["settleFeedRequest(string,bytes32)"](
              caption,
              radHash,
              { from }
            )
            utils.traceTx(tx.receipt)
          } else {
            utils.traceHeader(`Skipping '${caption}': already settled w/ RAD hash ${radHash}.`)
          }
        }
      } else {
        utils.traceHeader(`Skipping '${caption}': no code for ${key} at ${addresses[key]}.`)
      }
    } catch (ex) {
      console.info(`Couldn't handle '${key}': ${ex}`)
      process.exit(1)
    }
  }
}

function extractCaptionFromKey (key) {
  const decimals = key.match(/\d+$/)[0]
  const camels = key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, function (str) { return str.toUpperCase() })
    .split(" ")
  return `Price-${
    camels[camels.length - 2].toUpperCase()
  }/${
    camels[camels.length - 1].replace(/\d$/, "").toUpperCase()
  }-${decimals}`
}
