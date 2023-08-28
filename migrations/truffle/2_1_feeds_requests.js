const Witnet = require("witnet-utils")
const addresses = require("../witnet/addresses")

const WitnetPriceFeeds = artifacts.require("WitnetPriceFeeds")
const WitnetRequest = artifacts.require("WitnetRequest")

module.exports = async function (_deployer, network, [, from]) {
  const ecosystem = Witnet.Utils.getRealmNetworkFromArgs()[0]
  network = network.split("-")[0]
  await settlePriceFeedsRadHash(from, addresses[ecosystem][network].requests)
}

async function settlePriceFeedsRadHash (from, addresses) {
  const feeds = await WitnetPriceFeeds.deployed()
  for (const key in addresses) {
    try {
      if (Witnet.Utils.isNullAddress(addresses[key])) {
        throw "no address."
      }
      const caption = Witnet.Utils.extractErc2362CaptionFromKey("Price", key)
      if (!caption) continue;
      const hash = await feeds.hash.call(caption, { from })
      const request = await WitnetRequest.at(addresses[key])
      if ((await web3.eth.getCode(request.address)).length > 2) {
        let requestClass
        try {
          requestClass = await request.class.call({ from })
        } catch {
          throw `uncompliant request contract at ${addresses[key]}.`
        }
        if (requestClass !== "0xcfcd3875") {
          throw `uncompliant request contract at ${addresses[key]}: ${requestClass}`
        }
        const radHash = await request.radHash.call({ from })
        Witnet.Utils.traceHeader(`\x1b[1;34m${caption}\x1b[0m`)
        console.info("  ", `> ID4 hash:          \x1b[34m${hash}\x1b[0m`)
        console.info("  ", `> Request data type: \x1b[1;37m${Witnet.Utils.getRequestResultDataTypeString(await request.resultDataType.call())}\x1b[0m`)
        if (!(await feeds.supportsCaption.call(caption, { from }))) {  
          console.info("  ", `> Request artifact:  \x1b[1;37m${key}\x1b[0m`)
          console.info("  ", "> Request address:  ", request.address)
          console.info("  ", "> Request registry: ", await request.registry.call())  
          console.info("  ", `> Request RAD hash:  \x1b[1;36m${radHash.slice(2)}\x1b[0m`)
          const tx = await feeds.methods["settleFeedRequest(string,bytes32)"](
            caption,
            radHash,
            { from }
          )
          Witnet.Utils.traceTx(tx.receipt)
        } else {
          const currentRadHash = await feeds.lookupRadHash.call(hash, { from })
          if (radHash !== currentRadHash) {
            console.info("  ", "> Request artifact: ", key)
            console.info("  ", "> Request address:  ", request.address)
            console.info("  ", `> OLD request RAD hash: \x1b[36m${currentRadHash.slice(2)}\x1b[0m`)
            console.info("  ", `> NEW request RAD hash: \x1b[1;36m${radHash.slice(2)}\x1b[0m`)
            const tx = await feeds.methods["settleFeedRequest(string,bytes32)"](
              caption,
              radHash,
              { from }
            )
            Witnet.Utils.traceTx(tx.receipt)
          } else {
            console.info("  ", `> Request RAD hash:  \x1b[1;33m${radHash.slice(2)}\x1b[0m`)
          }
        }
      } else {
        Witnet.Utils.traceHeader(`\x1b[1;31m${caption}\x1b[0m`)
        console.info("  ", `> No code for ${key} at ${addresses[key]}`)
      }
    } catch (ex) {
      console.info(`Couldn't handle '\x1b[1;31m${key}\x1b[0m': ${ex}`)
      process.exit(1)
    }
  }
}
