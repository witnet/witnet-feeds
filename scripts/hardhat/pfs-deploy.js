const hre = require("hardhat")

const witnet = require("../../witnet/assets")
const network = hre.network.name
const routes = require("../../witnet/routes/price")
const utils = require("../utils")

module.exports = { run }

async function run (args) {
  const selection = args.captions?.map(caption => {
    return "Price-" + caption.toUpperCase()
  }) || []

  const [pfs] = await utils.getWitPriceFeedsContract(args?.from)

  await settlePriceFeedsRadHash(pfs, selection)
  await settlePriceFeedsSolvers(pfs, selection)

  console.info()
}

async function settlePriceFeedsRadHash (pfs, selection) {
  const addresses = witnet.getAddresses(network)?.requests
  const prices = Object.fromEntries(
    utils.flattenWitnetArtifacts(witnet.requests.price)
      .map(value => [value.key, value.artifact])
  )
  for (const key in prices) {
    const caption = utils.extractErc2362CaptionFromKey("Price", key)
    try {
      if (
        !caption ||
          (selection.length === 0 && utils.isNullAddress(addresses[key])) ||
          (selection.length > 0 && !selection.includes(caption))
      ) {
        continue
      }
      if (utils.isNullAddress(addresses[key])) {
        throw "Not deployed."
      }
      const hash = await pfs.hash(caption)
      const request = await utils.getWitOracleRequestContract(addresses[key])
      const requestClass = await request.class()
      const requestSpecs = await request.specs()
      if (requestSpecs !== "0xd210485c") {
        throw `Uncompliant request at ${addresses[key]}`
      }
      const radHash = await request.radHash()
      console.info()
      console.info("  ", `\x1b[1;94m${caption}\x1b[0m`)
      if (!(await pfs.supportsCaption(caption))) {
        console.info("  ", `> ID4 hash:          \x1b[94m${hash}\x1b[0m`)
        console.info("  ", `> RAD hash:          \x1b[32m${radHash.slice(2)}\x1b[0m`)
        console.info("  ", `> Request artifact:  \x1b[1;37m${key}\x1b[0m`)
        console.info("  ", "> Request address:  ", addresses[key])
        console.info("  ", "> Request class:    ", requestClass)
        const balance = BigInt(await hre.ethers.provider.getBalance(pfs.runner.address))
        const tx = await pfs["settleFeedRequest(string,bytes32)"](caption, radHash)
        await tx.wait()
        utils.traceTx(
          await hre.ethers.provider.getTransactionReceipt(tx.hash),
          balance - BigInt(await hre.ethers.provider.getBalance(pfs.runner.address)),
        )
      } else {
        console.info("  ", `> ID4 hash:          \x1b[94m${hash}\x1b[0m`)
        const currentRadHash = await pfs.lookupWitOracleRequestRadHash(hash)
        if (radHash !== currentRadHash) {
          console.info("  ", `> OLD RAD hash:      \x1b[32m${currentRadHash.slice(2)}\x1b[0m`)
          console.info("  ", `> NEW RAD hash:      \x1b[1;32m${radHash.slice(2)}\x1b[0m`)
          console.info("  ", "> Request artifact: ", key)
          console.info("  ", "> Request address:  ", addresses[key])
          console.info("  ", "> Request class:    ", requestClass)
          const balance = BigInt(await hre.ethers.provider.getBalance(pfs.runner.address))
          const tx = await pfs["settleFeedRequest(string,bytes32)"](caption, radHash)
          utils.traceTx(
            await hre.ethers.provider.getTransactionReceipt(tx.hash),
            balance - BigInt(await hre.ethers.provider.getBalance(pfs.runner.address)),
          )
        } else {
          console.info("  ", `> RAD hash:          \x1b[32m${radHash.slice(2)}\x1b[0m`)
          const retrievals = await pfs.lookupWitOracleRadonRetrievals(hash)
          const bytecode = await pfs.lookupWitOracleRequestBytecode(hash)
          const report = JSON.parse(await utils.dryRunBytecode(bytecode.slice(2)))
          const partials = report.retrieve?.map(retrieve => retrieve?.result)
          retrievals
            .map(retrieve => new URL(retrieve[3]).host.split(".").slice(-2, -1).join())
            .forEach((source, index) => {
              console.info("  ", `> Data source #${index + 1}:    \x1b[92m${source.toUpperCase()}\x1b[0m${" ".repeat(10 - source.length)} -> \x1b[33m${JSON.stringify(partials[index])}\x1b[0m`)
            })
          console.info("  ", `> Tally result:                 => \x1b[93m${JSON.stringify(report?.tally.result)}\x1b[0m`)
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

async function settlePriceFeedsSolvers (pfs, selection) {
  const addresses = await utils.readJsonFromFile("./witnet/addresses.json")
  if (!addresses[network]) addresses[network] = {}
  if (!addresses[network].solvers) addresses[network].solvers = {}

  for (const solverKey in routes) {
    for (const caption in routes[solverKey]) {
      const routeKey = utils.extractRouteKeyFromErc2362Caption(caption)
      if (
        (selection.length === 0 && !utils.isNullAddress(addresses[routeKey])) ||
          (selection.length > 0 && selection.includes(caption))
      ) {
        const routeAddr = await settlePriceFeedSolver(pfs, caption, solverKey)
        if (routeAddr) {
          addresses[network].solvers[routeKey] = routeAddr
          utils.overwriteJsonFile("./witnet/addresses.json", addresses)
        }
      }
    }
  }
};

async function settlePriceFeedSolver (pfs, caption, solverKey) {
  let solverAddr
  try {
    const solverSpecs = routes[solverKey][caption]
    solverAddr = await resolveSolverArtifactAddress(pfs, solverKey, solverSpecs)
    const solverContract = await utils.getWitPriceFeedsSolverContract(solverAddr)
    const solverClass = await solverContract.class()

    const hash = await pfs.hash(caption)
    const currentSolver = await pfs.lookupPriceSolver(hash)

    const header = `${caption}`
    console.info()
    console.info("  ", `\x1b[1;38;5;128m${caption}\x1b[0m`)

    if (
      solverAddr !== currentSolver[0] ||
        JSON.stringify(solverSpecs?.dependencies) !== JSON.stringify(currentSolver[1])
    ) {
      console.info("  ", "> ID4 hash:      ", `\x1b[94m${hash}\x1b[0m`)
      console.info("  ", "> Solver address:", `\x1b[96m${solverAddr}\x1b[0m`)
      console.info("  ", "> Solver class:  ", `\x1b[1;96m${solverClass}\x1b[0m`)
      console.info("  ", "> Solver deps:   ", `\x1b[92m${solverSpecs?.dependencies}\x1b[0m` || "(no dependencies)")
      const tx = await pfs.settleFeedSolver(caption, solverAddr, solverSpecs?.dependencies || [])
      do {
        const receipt = await hre.ethers.provider.getTransactionReceipt(tx.hash)
        if (!receipt) {
          await sleep(2000)
          continue
        } else {
          utils.traceTx(receipt)
          break
        }
      } while (true)
    } else {
      console.info("  ", "> ID4 hash:         ", `\x1b[34m${hash}\x1b[0m`)
      console.info("  ", "> Solver address:   ", `\x1b[36m${solverAddr}\x1b[0m`)
      console.info("  ", "> Solver class:     ", `\x1b[96m${solverClass}\x1b[0m`)
      console.info("  ", "> Solver deps:      ", `\x1b[32m${solverSpecs?.dependencies}\x1b[0m` || "(no dependencies)")
    }
  } catch (ex) {
    console.info("  ", "> Exception:", unescape(ex))
  }
  return solverAddr
}

async function resolveSolverArtifactAddress (pfs, solverKey, solverSpecs) {
  const solverArtifact = await hre.artifacts.readArtifact(solverKey)
  const argsValues = solverSpecs?.constructorArgs || []
  const argsTypes = utils.extractArtifactConstructorArgsTypes(solverArtifact) || []
  const args = hre.web3.eth.abi.encodeParameters(argsTypes, argsValues)

  const solverAddr = await pfs.determinePriceSolverAddress(solverArtifact.bytecode, args)

  if ((await hre.web3.eth.getCode(solverAddr)).length <= 3) {
    const header = `${solverKey}${argsValues.length > 0
      ? `<${JSON.stringify(argsValues)}>`
      : ""
    }`
    console.info()
    console.info("  ", `\x1b[1;96m${header}\x1b[0m`)
    if (argsTypes.length > 0) {
      console.info("  ", "> Constructor types array:", argsTypes)
    }
    console.info("  ", "> Constructor args: ", `\x1b[1;33m${args.slice(2)}\x1b[0m`)
    console.info("  ", "> Contract address: ", `\x1b[96m${solverAddr}\x1b[0m`)
    const tx = await pfs.deployPriceSolver(solverArtifact.bytecode, args)
    do {
      const receipt = await hre.ethers.provider.getTransactionReceipt(tx.hash)
      if (!receipt) {
        await sleep(2000)
        continue
      } else {
        utils.traceTx(receipt)
        break
      }
    } while (true)
  }
  return solverAddr
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
