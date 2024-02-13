const hre = require("hardhat");

const witnet = require("../../witnet/assets")
const network = hre.network.name
const routes = require("../../witnet/routes/price")
const utils = require("../utils")

module.exports = { run };

async function run(args) {
  const [ pfs, ] = await utils.getWitnetPriceFeedsContract();
  const targets = args?.artifacts ? args.artifacts.split(",") : [];
  await settlePriceFeedsRadHash(pfs, targets)
  await settlePriceFeedsRoutes(pfs, targets)
}

async function settlePriceFeedsRadHash (pfs, targets) {
  const addresses = witnet.getAddresses(network)?.requests;  
  // TODO: flatten artifacts within witnet.requests.price
  for (const key in witnet.requests.price.cryptos) {
    const caption = utils.extractErc2362CaptionFromKey("Price", key)
    try {
      if (
        !caption 
        || (targets.length == 0 && utils.isNullAddress(addresses[key]))
        || (targets.length > 0 && !targets.includes(key))
      ) {
        continue;
      }
      if (!caption || (targets.length > 0 && !targets.includes(key))) continue;
      if (utils.isNullAddress(addresses[key])) {
        throw "Not deployed."
      }
      const hash = await pfs.hash(caption)
      const request = await utils.getWitnetRequestContract(addresses[key])
      const requestClass = await request.class()
      if (requestClass !== "WitnetRequest") {
        throw `Uncompliant request at ${addresses[key]}`
      }
      const radHash = await request.radHash()
      console.info()
      console.info("  ", `\x1b[1;94m${caption}\x1b[0m`)
      console.info("  ", "=".repeat(caption.length))
      if (!(await pfs.supportsCaption(caption))) {
        console.info("  ", `> ID4 hash:          \x1b[94m${hash}\x1b[39m`)
        console.info("  ", `> Request artifact:  \x1b[1;37m${key}\x1b[39m`)
        console.info("  ", "> Request address:  ", addresses[key])
        console.info("  ", "> Request registry: ", await request.registry())
        console.info("  ", `> Request RAD hash:  \x1b[32m${radHash.slice(2)}\x1b[39m`)
        const tx = await pfs["settleFeedRequest(string,bytes32)"](caption, radHash)
        utils.traceTx(await hre.ethers.provider.getTransactionReceipt(tx.hash))
      } else {
        console.info("  ", `> ID4 hash:          \x1b[34m${hash}\x1b[39m`)
        const currentRadHash = await pfs.lookupRadHash(hash)
        if (radHash !== currentRadHash) {
          console.info("  ", "> Request artifact: ", key)  
          console.info("  ", "> Request address:  ", addresses[key])
          console.info("  ", `> OLD RAD hash:      \x1b[32m${currentRadHash.slice(2)}\x1b[39m`)
          console.info("  ", `> NEW RAD hash:      \x1b[1;32m${radHash.slice(2)}\x1b[39m`)
          const tx = await pfs["settleFeedRequest(string,bytes32)"](caption, radHash)
          utils.traceTx(await hre.ethers.provider.getTransactionReceipt(tx.hash))
        } else {
          console.info("  ", `> RAD hash:          \x1b[32m${radHash.slice(2)}\x1b[39m`)
          const latest = await pfs.latestPrice(hash)
          if (latest[2] !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
            console.info("  ", "> Latest status:    ", utils.getWitnetResultStatusString(latest[3]))
            if (latest[1]) {
              console.info("  ", "> Latest update:    ", new Date(parseInt(BigInt(latest[1]).toString())).toLocaleTimeString())
            }
          }
        }
      }
    } catch (ex) {
      console.info()
      console.info("  ", `\x1b[1;31m${caption}\x1b[0m`)
      console.info("  ", "=".repeat(caption.length))
      console.info("  ", `> ${ex}`)
    }
  }
};

async function settlePriceFeedsRoutes (pfs, targets) {
  const addresses = await utils.readJsonFromFile("./witnet/addresses.json");
  if (!addresses[network]) addresses[network] = {}
  if (!addresses[network].routes) addresses[network].routes = {}

  for (const solverKey in routes) {
    for (const caption in routes[solverKey]) {
      const routeKey = utils.extractKeyFromErc2362Caption(caption)
      if (
        addresses[network].routes[routeKey] !== undefined
          || targets.includes(routeKey)
      ) {
        const routeAddr = await settlePriceFeedRoute(pfs, caption, solverKey);
        if (routeAddr) {
          addresses[network].routes[routeKey] = routeAddr
          utils.overwriteJsonFile("./witnet/addresses.json", addresses)
        }
      }
    }
  }
};

async function settlePriceFeedRoute (pfs, caption, solverKey) {

  let solverAddr
  try {
    const solverSpecs = routes[solverKey][caption]
    solverAddr = await resolveSolverArtifactAddress(pfs, solverKey, solverSpecs) 
    const solverContract = await utils.getWitnetPriceSolverContract(solverAddr)
    const solverClass = await solverContract.class()
    
    const hash = await pfs.hash(caption)
    const currentSolver = await pfs.lookupPriceSolver(hash)

    const header = `${caption}`
    console.info()
    console.info("  ", `\x1b[1;38;5;128m${caption}\x1b[0m`)
    console.info("  ", "=".repeat(header.length))
    
    if (
      solverAddr !== currentSolver[0]
        || JSON.stringify(solverSpecs?.dependencies) !== JSON.stringify(currentSolver[1])
    ) {
      console.info("  ", "> ID4 hash:      ", `\x1b[94m${hash}\x1b[39m`)
      console.info("  ", "> Solver address:", `\x1b[96m${solverAddr}\x1b[0m`)
      console.info("  ", "> Solver class:  ", `\x1b[1;96m${solverClass}\x1b[0m`)
      console.info("  ", "> Solver deps:   ", `\x1b[92m${solverSpecs?.dependencies}\x1b[0m` || "(no dependencies)")
      const tx = await pfs.settleFeedSolver(caption, solverAddr, solverSpecs?.dependencies || [])
      utils.traceTx(await hre.ethers.provider.getTransactionReceipt(tx.hash))

    } else {
      console.info("  ", "> ID4 hash:         ", `\x1b[34m${hash}\x1b[39m`)
      console.info("  ", "> Solver address:   ", `\x1b[36m${solverAddr}\x1b[0m`)
      console.info("  ", "> Solver class:     ", `\x1b[96m${solverClass}\x1b[0m`)
      console.info("  ", "> Solver deps:      ", `\x1b[32m${solverSpecs?.dependencies}\x1b[0m` || "(no dependencies)")
    }
  } catch (ex) {
    console.info("  ", "> Exception:", unescape(ex))
  }
  return solverAddr
}

async function resolveSolverArtifactAddress(pfs, solverKey, solverSpecs) {  
  
  const solverArtifact = await hre.artifacts.readArtifact(solverKey);
  const argsValues = solverSpecs?.constructorArgs || []
  const argsTypes = utils.extractArtifactConstructorArgsTypes(solverArtifact) || []
  const args = hre.web3.eth.abi.encodeParameters(argsTypes, argsValues)
  
  const solverAddr = await pfs.determinePriceSolverAddress(solverArtifact.bytecode, args)
  
  if ((await hre.web3.eth.getCode(solverAddr)).length <= 3) {
    const header = `${solverKey}${argsValues.length > 0 ? 
      `<${JSON.stringify(argsValues)}>` : ""
    }`
    console.info()
    console.info("  ", `\x1b[1;96m${header}\x1b[0m`)
    console.info("  ", "=".repeat(header.length))
    if (argsTypes.length > 0) {
      console.info("  ", "> Constructor types array:", argsTypes)
    }
    console.info("  ", "> Constructor args: ", `\x1b[1;33m${args.slice(2)}\x1b[0m`)
    console.info("  ", "> Contract address: ", `\x1b[96m${solverAddr}\x1b[0m`)
    const tx = await pfs.deployPriceSolver(solverArtifact.bytecode, args)
    utils.traceTx(await hre.ethers.provider.getTransactionReceipt(tx.hash))
  }
  return solverAddr
}

