const utils = require("../../assets/witnet/utils/js")
const witnet = require("../../assets/witnet")

const WitnetBytecodes = artifacts.require("WitnetBytecodes")
const WitnetEncodingLib = artifacts.require("WitnetEncodingLib")
const WitnetErrorsLib= artifacts.require("WitnetErrorsLib")
const WitnetPriceFeeds = artifacts.require("WitnetPriceFeeds")
const WitnetRandomness = artifacts.require("WitnetRandomness")
const WitnetRequestBoard = artifacts.require("WitnetRequestBoard")
const WitnetRequestFactory = artifacts.require("WitnetRequestFactory")

const WitnetBytecodesDefault = artifacts.require("WitnetBytecodesDefault")
const WitnetPriceFeedsUpgradable = artifacts.require("WitnetPriceFeedsUpgradable")
const WitnetRandomnessProxiable = artifacts.require("WitnetRandomnessProxiable")
const WitnetRequestBoardDefault = artifacts.require("WitnetRequestBoardTrustableDefault")
const WitnetRequestFactoryDefault = artifacts.require("WitnetRequestFactoryDefault");
const WitnetRequestRandomness = artifacts.require("WitnetRequestRandomness")

module.exports = async function (deployer, network, [, from]) {
  const isDryRun = network === "test" || network.split("-")[1] === "fork" || network.split("-")[0] === "develop"
  const ecosystem = utils.getRealmNetworkFromArgs()[0]
  network = network.split("-")[0]

  var witnetAddresses
  if (!isDryRun) {
    try {
      witnetAddresses = witnet.addresses[ecosystem][network]
      WitnetBytecodes.address = witnetAddresses.WitnetBytecodes
      WitnetPriceFeeds.address= witnetAddresses.WitnetPriceFeeds
      WitnetRandomness.address = witnetAddresses.WitnetRandomness
      WitnetRequestBoard.address = witnetAddresses.WitnetRequestBoard
      WitnetRequestFactory.address = witnetAddresses.WitnetRequestFactory
      utils.traceHeader("Witnet artifacts:")
      console.info("  ", "> WitnetBytecodes:      ", WitnetBytecodes.address)
      console.info("  ", "> WitnetPriceFeeds:     ", WitnetPriceFeeds.address)
      console.info("  ", "> WitnetRandomness:     ", WitnetRandomness.address)
      console.info("  ", "> WitnetRequestBoard:   ", WitnetRequestBoard.address)
      console.info("  ", "> WitnetRequestFactory: ", WitnetRequestFactory.address)
    } catch (e) {
      console.error("Fatal: Witnet Foundation addresses were not provided!", e)
      process.exit(1)
    }
  } else {
    await deployer.deploy(WitnetEncodingLib, { from })
    await deployer.link(WitnetEncodingLib, WitnetBytecodesDefault)
    await deployer.deploy(WitnetErrorsLib, { from })
    await deployer.link(WitnetErrorsLib, WitnetRequestBoardDefault)
    await deployer.deploy(WitnetBytecodesDefault, false, utils.fromAscii(network), { from, gas: 6721975 })
    WitnetBytecodes.address = WitnetBytecodesDefault.address
    await deployer.deploy(WitnetRequestFactoryDefault, WitnetBytecodes.address, false, utils.fromAscii(network), { from, gas: 6721975 })
    WitnetRequestFactory.address = WitnetRequestFactoryDefault.address
    await deployer.deploy(WitnetRequestBoardDefault, WitnetRequestFactory.address, false, utils.fromAscii(network), 135000, { from, gas: 6721975 })
    WitnetRequestBoard.address = WitnetRequestBoardDefault.address
    await deployer.deploy(WitnetPriceFeedsUpgradable, WitnetRequestBoard.address, false, utils.fromAscii(network), { from, gas: 6721975 })
    WitnetPriceFeeds.address = WitnetPriceFeedsUpgradable.address
    await deployer.deploy(WitnetRequestRandomness, { from })
    await deployer.deploy(WitnetRandomnessProxiable, WitnetRequestBoard.address, WitnetRequestRandomness.address, utils.fromAscii(network), { from, gas: 6721975 })
    WitnetRandomness.address = WitnetRandomnessProxiable.address
    const addresses = require("../witnet/addresses")
    if (addresses[ecosystem] && addresses[ecosystem][network]) {
      delete addresses[ecosystem][network]
      utils.saveAddresses(addresses)
    }
  }
}