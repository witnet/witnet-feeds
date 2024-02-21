const hre = require("hardhat");

const witnet = require("../witnet/assets")
const addresses = witnet.getAddresses(hre.network.name)
const utils = require("witnet-solidity/utils")

module.exports = {
    camelize,
    extractArtifactConstructorArgsTypes,
    extractErc2362CaptionFromKey,
    extractRequestKeyFromErc2362Caption,
    extractRouteKeyFromErc2362Caption,
    flattenWitnetArtifacts: utils.flattenWitnetArtifacts,
    getWitnetPriceFeedsContract,
    getWitnetPriceRouteSolverContract,
    getWitnetRequestContract,
    getWitnetRequestResultDataTypeString,
    getWitnetResultStatusString,
    isDryRun: utils.isDryRun,
    isNullAddress: utils.isNullAddress,
    numberWithCommas,
    overwriteJsonFile: utils.overwriteJsonFile,
    readJsonFromFile: utils.readJsonFromFile,
    secondsToTime,
    traceHeader: utils.traceHeader,
    traceTx,
    traceWitnetPriceFeed,
    traceWitnetPriceRoute,
}

function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toUpperCase() : word.toLowerCase();
    }).replace(/\s+/g, '');
}

function extractArtifactConstructorArgsTypes(artifact) {
    const constructor = artifact.abi.filter(method => method.type === "constructor")[0]
    let constructorParams = []
    constructor.inputs.map(input => {
        if (input.type !== "tuple") {
            constructorParams.push(input.type)
        } else {
            constructorParams = constructorParams.concat(_extractArtifactTupleTypesArray(input.components))
        }
    })
    return constructorParams
}

function _extractArtifactTupleTypesArray(tuple) {
    let tupleParams = []
    tuple.map(component => {
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
    } else return null;
} 

function extractRequestKeyFromErc2362Caption (caption) {
    let parts = caption.split("-")
    const decimals = parts[parts.length - 1]
    parts = parts[1].split("/")
    return `WitnetRequestPrice${camelize(parts[0])}${camelize(parts[1])}${decimals}`
}

function extractRouteKeyFromErc2362Caption (caption) {
    let parts = caption.split("-")
    const decimals = parts[parts.length - 1]
    parts = parts[1].split("/")
    return `WitnetPriceFeedRoute${camelize(parts[0])}${camelize(parts[1])}${decimals}`
}

async function getWitnetPriceFeedsContract(from) {
    if (!addresses?.WitnetPriceFeeds) {
        throw Error(`No WitnetPriceFeeds on network "${hre.network.name}"`)
    }
    const header = `${hre.network.name.toUpperCase()}`
    console.info()
    console.info("  ", `\x1b[1;96m${header}\x1b[0m`)
    console.info("  ", "=".repeat(header.length))

    process.stdout.write("   \x1b[97mWitnetPriceFeeds:\x1b[0m       ")
    const WitnetPriceFeeds = await hre.ethers.getContractAt(
        witnet.artifacts.WitnetPriceFeeds.abi,
        addresses.WitnetPriceFeeds,
        from ? (await hre.ethers.getSigner(from)) : (await hre.ethers.getSigners())[3]
    );
    process.stdout.write("\x1b[96m" 
        + await _readUpgradableArtifactVersion(WitnetPriceFeeds)
        + "\x1b[0m\n"
    );

    process.stdout.write("   \x1b[97mWitnetOracle:\x1b[0m           ")
    const WitnetOracle = await hre.ethers.getContractAt(
        witnet.artifacts.WitnetOracle.abi,
        await WitnetPriceFeeds.witnet()
    ); 
    process.stdout.write("\x1b[36m"
        + await _readUpgradableArtifactVersion(WitnetOracle) 
        + "\x1b[0m\n"
    );

    process.stdout.write("   \x1b[97mWitnetRequestBytecodes:\x1b[0m ")
    const WitnetRequestBytecodes = await hre.ethers.getContractAt(
        witnet.artifacts.WitnetRequestBytecodes.abi,
        await WitnetOracle.registry()
    );
    const WitnetRequestBytecodesAddr = await WitnetRequestBytecodes.getAddress()
    process.stdout.write("\x1b[36m"
        + await _readUpgradableArtifactVersion(WitnetRequestBytecodes)
        + "\x1b[0m\n"
    );

    process.stdout.write("   \x1b[97mWitnetRequestFactory:  \x1b[0m ")
    const WitnetRequestFactory = await hre.ethers.getContractAt(
        witnet.artifacts.WitnetRequestFactory.abi,
        await WitnetOracle.factory()
    );
    process.stdout.write("\x1b[36m"
        + await _readUpgradableArtifactVersion(WitnetRequestFactory)
        + "\x1b[0m\n"
    );

    return [WitnetPriceFeeds, WitnetRequestBytecodesAddr]
}

async function getWitnetPriceRouteSolverContract(address) {
    return hre.ethers.getContractAt(witnet.artifacts.WitnetPriceRouteSolver.abi, address)
}

async function getWitnetRequestContract(address) {
    return hre.ethers.getContractAt(witnet.artifacts.WitnetRequest.abi, address);
}

function getWitnetRequestResultDataTypeString(type) {
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

function getWitnetResultStatusString(status) {
    const literals = {
        1: "Awaiting",
        2: "Ready",
        3: "Error",
        4: "Finalizing",
        5: "Finalizing",
    }
    return literals[status] || "Unknown"
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function secondsToTime(secs) {
    secs = Math.round(secs);
    var hours = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    var obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
    };
    return obj;
}

function traceTx (receipt, cost) {
    console.info("  ", "> Transaction block:", receipt?.blockNumber)
    console.info("  ", "> Transaction hash: ", receipt?.hash)
    console.info("  ", "> Transaction gas:  ", numberWithCommas(parseInt(BigInt(receipt?.gasUsed || receipt?.gasLimit).toString())))
    if (cost) {
        console.info("  ", "> Transaction cost: \x1b[90m", 
            (parseFloat(cost || 0.0) / 10 ** 18).toFixed(3), 
            "\x1b[0mETH"
        );
    }
}

function traceWitnetPriceFeed(caption, hash, radHash, latestTimestamp) {
    console.info()
    console.info("  ", `\x1b[1;94m${caption}\x1b[0m`)
    console.info("  ", "=".repeat(caption.length))

    console.info("  ", `> ID4 hash:       \x1b[34m${hash}\x1b[0m`)
    console.info("  ", `> RAD hash:       \x1b[32m${radHash.slice(2)}\x1b[0m`)
    if (latestTimestamp) {
        console.info("  ", "> Latest update: ",
            secondsToTime(Date.now() / 1000 - parseInt(latestTimestamp.toString())), 
            "ago",
        );
    }
}

function traceWitnetPriceRoute(
        caption, hash, 
        solverAddr, solverClass, solverDeps, 
        latestTimestamp
) {
    console.info()
    console.info("  ", `\x1b[1;38;5;128m${caption}\x1b[0m`)
    console.info("  ", "=".repeat(caption.length))

    console.info("  ", `> ID4 hash:       \x1b[34m${hash}\x1b[0m`)
    console.info("  ", "> Solver address:", `\x1b[36m${solverAddr}\x1b[0m`)
    console.info("  ", "> Solver class:  ", `\x1b[96m${solverClass}\x1b[0m`)
    console.info("  ", "> Solver deps:   ", `\x1b[32m${solverDeps}\x1b[0m` || "(no dependencies)")
    if (latestTimestamp) {
        console.info("  ", "> Latest update: ", secondsToTime(Date.now() / 1000 - latestTimestamp), "ago")
    }
};

async function _readUpgradableArtifactVersion(contract) {
    const addr = await contract.getAddress()
    try {
        const upgradable = await hre.ethers.getContractAt(
            witnet.artifacts.WitnetUpgradableBase.abi,
            addr
        );
        return `${addr} (v${await upgradable.version()})`
    } catch (e) {
        console.log(e)
        return `${addr} (???)`
    }
}


