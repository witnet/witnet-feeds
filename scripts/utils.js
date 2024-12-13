const hre = require("hardhat")

const witnet = require("../witnet/assets")
const addresses = witnet.getAddresses(hre.network.name)
const utils = require("witnet-solidity/utils")

module.exports = {
  camelize,
  dryRunBytecode: utils.dryRunBytecode,
  dryRunBytecodeVerbose: utils.dryRunBytecodeVerbose,
  extractArtifactConstructorArgsTypes,
  extractErc2362CaptionFromKey,
  extractRequestKeyFromErc2362Caption,
  extractRouteKeyFromErc2362Caption,
  flattenWitnetArtifacts: utils.flattenWitnetArtifacts,
  getWitOracleRequestContract,
  getWitOracleRequestResultDataTypeString,
  getWitPriceFeedsContract,
  getWitPriceFeedsLatestUpdateStatus,
  getWitPriceFeedsSolverContract,
  isDryRun: utils.isDryRun,
  isNullAddress: utils.isNullAddress,
  numberWithCommas,
  overwriteJsonFile: utils.overwriteJsonFile,
  readJsonFromFile: utils.readJsonFromFile,
  secondsToTime,
  traceHeader: utils.traceHeader,
  traceTx,
  traceWitnetPriceFeed,
  traceWitnetPriceSolver,
}

function camelize (str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
    return index === 0 ? word.toUpperCase() : word.toLowerCase()
  }).replace(/\s+/g, "")
}

function extractArtifactConstructorArgsTypes (artifact) {
  const constructor = artifact.abi.filter(method => method.type === "constructor")[0]
  let constructorParams = []
  constructor.inputs.forEach(input => {
    if (input.type !== "tuple") {
      constructorParams.push(input.type)
    } else {
      constructorParams = constructorParams.concat(_extractArtifactTupleTypesArray(input.components))
    }
  })
  return constructorParams
}

function _extractArtifactTupleTypesArray (tuple) {
  let tupleParams = []
  tuple.forEach(component => {
    if (component.type !== "tuple") {
      tupleParams.push(component.type)
    } else {
      tupleParams = tupleParams.concat(_extractArtifactTupleTypesArray(component.components))
    }
  })
  return tupleParams
}

function extractErc2362CaptionFromKey (prefix, key) {
  const decimals = key.match(/\d+$/)
  if (decimals) {
    const camels = key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, function (str) { return str.toUpperCase() })
      .split(" ")
    return `${prefix}-${
      camels[camels.length - 2].toUpperCase()
    }/${
      camels[camels.length - 1].replace(/\d$/, "").toUpperCase()
    }-${decimals[0]}`
  } else return null
}

function extractRequestKeyFromErc2362Caption (caption) {
  let parts = caption.split("-")
  const decimals = parts[parts.length - 1]
  parts = parts[1].split("/")
  return `WitOracleRequestPrice${camelize(parts[0])}${camelize(parts[1])}${decimals}`
}

function extractRouteKeyFromErc2362Caption (caption) {
  let parts = caption.split("-")
  const decimals = parts[parts.length - 1]
  parts = parts[1].split("/")
  return `WitPriceFeedSolver${camelize(parts[0])}${camelize(parts[1])}${decimals}`
}

async function getWitPriceFeedsContract (from) {
  if (!addresses.apps?.WitPriceFeeds) {
    throw Error(`No WitPriceFeeds on network "${hre.network.name}"`)
  }
  const header = `${hre.network.name.toUpperCase()}`
  console.info()
  console.info("  ", `\x1b[1;96m${header}\x1b[0m`)
  console.info("  ", "=".repeat(header.length))

  process.stdout.write("   \x1b[97mWitOracle:\x1b[0m               ")
  const WitOracle = await hre.ethers.getContractAt(
    witnet.artifacts.WitOracle.abi,
    addresses.core?.WitOracle,
  )
  process.stdout.write("\x1b[36m" +
        await _readUpgradableArtifactVersion(WitOracle) +
        "\x1b[0m\n"
  )

  process.stdout.write("   \x1b[97mWitOracleRadonRegistry:\x1b[0m  ")
  const WitOracleRadonRegistry = await hre.ethers.getContractAt(
    witnet.artifacts.WitOracleRadonRegistry.abi,
    addresses.core?.WitOracleRadonRegistry,
  )
  const WitOracleRadonRegistryAddr = await WitOracleRadonRegistry.getAddress()
  process.stdout.write("\x1b[36m" +
        await _readUpgradableArtifactVersion(WitOracleRadonRegistry) +
        "\x1b[0m\n"
  )

  process.stdout.write("   \x1b[97mWitOracleRequestFactory:\x1b[0m ")
  const WitOracleRequestFactory = await hre.ethers.getContractAt(
    witnet.artifacts.WitOracleRequestFactory.abi,
    addresses.core?.WitOracleRequestFactory,
  )
  process.stdout.write("\x1b[36m" +
        await _readUpgradableArtifactVersion(WitOracleRequestFactory) +
        "\x1b[0m\n"
  )

  process.stdout.write("   \x1b[97mWitPriceFeeds:\x1b[0m           ")
  const WitPriceFeeds = await hre.ethers.getContractAt(
    witnet.artifacts.WitPriceFeeds.abi,
    addresses.apps?.WitPriceFeeds,
    from ? (await hre.ethers.getSigner(from)) : (await hre.ethers.getSigners())[3]
  )
  process.stdout.write("\x1b[96m" +
        await _readUpgradableArtifactVersion(WitPriceFeeds) +
        "\x1b[0m\n"
  )

  return [WitPriceFeeds, WitOracleRadonRegistryAddr]
}

async function getWitPriceFeedsSolverContract (address) {
  return hre.ethers.getContractAt(witnet.artifacts.IWitPriceFeedsSolver.abi, address)
}

async function getWitOracleRequestContract (address) {
  return hre.ethers.getContractAt(witnet.artifacts.WitOracleRequest.abi, address)
}

function getWitOracleRequestResultDataTypeString (type) {
  const types = {
    1: "Array",
    2: "Bool",
    3: "Bytes",
    4: "Integer",
    5: "Float",
    6: "Map",
    7: "String",
  }
  return types[type] || "(Undetermined)"
}

function getWitPriceFeedsLatestUpdateStatus (type) {
  const types = {
    0: "Void",
    1: "Awaiting",
    2: "Ready",
    3: "Error",
  }
  return types[type] || "(Undetermined)"
}

function numberWithCommas (x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function secondsToTime (secs) {
  secs = Math.round(secs)
  const hours = Math.floor(secs / (60 * 60))

  const divisorForMinutes = secs % (60 * 60)
  const minutes = Math.floor(divisorForMinutes / 60)

  const divisorForSeconds = divisorForMinutes % 60
  const seconds = Math.ceil(divisorForSeconds)

  const obj = {
    h: hours,
    m: minutes,
    s: seconds,
  }
  return obj
}

function traceTx (receipt, cost) {
  console.info("  ", "> Transaction block:", receipt?.blockNumber)
  console.info("  ", "> Transaction hash: ", receipt?.hash)
  console.info(
    "  ", "> Transaction gas:  ",
    numberWithCommas(parseInt(BigInt(receipt?.gasUsed || receipt?.gasLimit).toString()))
  )
  if (cost) {
    console.info("  ", "> Transaction cost: \x1b[90m",
      (parseFloat(cost || 0.0) / 10 ** 18).toFixed(3),
      "\x1b[0mETH"
    )
  }
}

async function traceWitnetPriceFeed (pfs, caption, id4, radHash, latest, liveResult) {
  console.info()
  console.info("  ", `\x1b[1;94m${caption}\x1b[0m`)

  console.info("  ", `> ID4 hash:          \x1b[94m${id4}\x1b[0m`)
  console.info("  ", `> RAD hash:          \x1b[92m${radHash.slice(2)}\x1b[0m`)
  const parts = caption.split("-")
  const exponent = parseInt(parts[parts.length - 1])
  const quote = parts[1].split("/")[1]
  let lastKnownPrice
  if (latest[2] !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
    if (latest[1]) {
      console.info(
        "  ", "> Last update:      ",
        secondsToTime(Date.now() / 1000 - parseInt(latest[1].toString())), "ago"
      )    
      lastKnownPrice = parseInt(latest[0].toString()) / 10 ** exponent
      console.info("  ", `> Last known price:  \x1b[1;38m${lastKnownPrice} ${quote}\x1b[0m`)
    }
  }
  if (lastKnownPrice && liveResult && liveResult?.RadonInteger) {
    const livePrice = parseInt(liveResult?.RadonInteger) / 10 ** exponent
    const deviation = (100 * (livePrice - lastKnownPrice) / lastKnownPrice).toFixed(2)
    if (Math.abs(deviation).toString() !== "0") {
      const symbol = deviation > 0 ? "+" : "-"
      console.info("  ", `> Current deviation: \x1b[1;93m${symbol} ${Math.abs(deviation)}\x1b[33m%\x1b[0m`)
    }
  }
  const latestStatus = getWitPriceFeedsLatestUpdateStatus(latest[3])
  try {
    if (latestStatus === "Error") {
      console.info("  ", "> Latest attempt:   \x1b[31m", await pfs.latestUpdateQueryResultStatusDescription(id4), "\x1b[0m")
    
    } else if (latestStatus === "Awaiting") {
      console.info("  ", `> Awaiting query:    \x1b[33m# ${(await pfs.latestUpdateQueryId(id4)).toString()}\x1b[0m`)
    }
  } catch (e) {
    console.info("  ", "> Cannot get latest update info:", e)
  }
}

function traceWitnetPriceSolver (
  caption, hash,
  solverAddr, solverClass, solverDeps,
  latestTimestamp
) {
  console.info()
  console.info("  ", `\x1b[1;38;5;128m${caption}\x1b[0m`)

  console.info("  ", `> ID4 hash:       \x1b[94m${hash}\x1b[0m`)
  console.info("  ", "> Solver address:", `\x1b[96m${solverAddr}\x1b[0m`)
  console.info("  ", "> Solver class:  ", `\x1b[1;96m${solverClass}\x1b[0m`)
  console.info("  ", "> Solver deps:   ", `\x1b[32m${solverDeps}\x1b[0m` || "(no dependencies)")
  if (latestTimestamp) {
    console.info("  ", "> Latest update: ", secondsToTime(Date.now() / 1000 - latestTimestamp), "ago")
  }
};

async function _readUpgradableArtifactVersion (contract) {
  const addr = await contract.getAddress()
  try {
    const upgradable = await hre.ethers.getContractAt(
      witnet.artifacts.WitnetUpgradableBase.abi,
      addr
    )
    return `${addr} (v${await upgradable.version()})`
  } catch (e) {
    console.log(e)
    return `${addr} (???)`
  }
}
