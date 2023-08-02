const addresses = require("../witnet/addresses")
const solvers = require("../witnet/solvers")
const utils = require("../../assets/witnet/utils/js")

const selection = utils.getWitnetArtifactsFromArgs()

const WitnetPriceFeeds = artifacts.require("WitnetPriceFeeds")

module.exports = async function (_deployer, network, [, from]) {
  const isDryRun = network === "test" || network.split("-")[1] === "fork" || network.split("-")[0] === "develop"
  const ecosystem = utils.getRealmNetworkFromArgs()[0]
  network = network.split("-")[0]

  if (!addresses[ecosystem]) addresses[ecosystem] = {}
  if (!addresses[ecosystem][network]) addresses[ecosystem][network] = {}
  if (!addresses[ecosystem][network].solvers) addresses[ecosystem][network].solvers = {}

  const feeds = await WitnetPriceFeeds.deployed()
  for (const key in solvers) {
    const solverArtifact = artifacts.require(key)
    for (const caption in solvers[key]) {
      const solverName = extractKeyFromCaption(caption)
      if (
        addresses[ecosystem][network].solvers[solverName] !== undefined ||
        (selection.length == 0 && isDryRun) || 
        (selection.length > 0 && selection.includes(solverName))
      ) {
        await settlePriceFeedSolver(
          feeds,
          from,
          caption,
          solverArtifact,
          solvers[key][caption]
        )
        addresses[ecosystem][network].solvers[solverName] = solverArtifact.address
      }
    }
    utils.saveAddresses(addresses)
  }
}

function extractArtifactTupleTypesArray(tuple) {
  let tupleParams = []
  tuple.map(component => {
    if (component.type !== "tuple") {
      tupleParams.push(component.type)
    } else {
      tupleParams = tupleParams.concat(extractArtifactTupleTypesArray(component.components))
    }
  })
  return tupleParams
}

function extractArtifactConstructorTypesArray(artifact) {
  const constructor = artifact.abi.filter(method => method.type === "constructor")[0]
  let constructorParams = []
  constructor.inputs.map(input => {
    if (input.type !== "tuple") {
      constructorParams.push(input.type)
    } else {
      constructorParams = constructorParams.concat(extractArtifactTupleTypesArray(input.components))
    }
  })
  return constructorParams
}
async function resolveSolverArtifactAddress(factory, from, artifact, parameters) {
  const solverTypesArray = extractArtifactConstructorTypesArray(artifact) || []
  try {
    web3.eth.abi.encodeParameters(solverTypesArray, parameters)
  } catch (ex) {
    throw `Solver artifact: ${artifact.contractName}\nConstructor types array: ${solverTypesArray}\nConstructor parameters: ${parameters}\n${ex}`
  }
  const solverAddr = await factory.determinePriceSolverAddress.call(
    artifact?.bytecode,
    web3.eth.abi.encodeParameters(solverTypesArray, parameters)
  )
  if ((await web3.eth.getCode(solverAddr)).length <= 3) {
    try {
      utils.traceHeader(`Instantiating '${artifact.contractName}${parameters.length > 0 
        ? `<${JSON.stringify(parameters)}>` 
        : ""
      }':`)
    } catch (ex) {
      
    }
    if (solverTypesArray.length > 0) {
      console.info("  ", "> Constructor types array:", solverTypesArray)  
    }
    console.info("  ", "> Constructor params:     ", web3.eth.abi.encodeParameters(solverTypesArray, parameters))
    console.info("  ", "> From address:           ", from)
    console.info("  ", "> Factory address:        ", factory.address)
    console.info("  ", "> Counter-factual address:", solverAddr)
    const tx = await factory.deployPriceSolver(
      artifact?.bytecode,
      web3.eth.abi.encodeParameters(solverTypesArray, parameters),
      { from }
    )
    utils.traceTx(tx.receipt)
  }
  artifact.address = solverAddr
  return solverAddr
}

async function settlePriceFeedSolver (feeds, from, caption, solverArtifact, solverSpecs) {
  try {
    await resolveSolverArtifactAddress(
      feeds,
      from,
      solverArtifact,
      solverSpecs?.constructorParams || []
    )
    const hash = await feeds.hash.call(caption, { from })
    const currentSolver = await feeds.lookupPriceSolver.call(hash, { from })
    let doSettlement = false
    utils.traceHeader(`\x1b[1;34m${caption}\x1b[0m`)
      console.info("  ", `> ID4 hash:          \x1b[34m${hash}\x1b[0m`)
    if (
      solverArtifact.address === currentSolver[0] &&
        JSON.stringify(solverSpecs?.dependencies) === JSON.stringify(currentSolver[1])
    ) {
      // utils.traceHeader(`Skipping '\x1b[34m${caption}\x1b[0m':`)
    } else {
      doSettlement = true
      if (!(await feeds.supportsCaption.call(caption, { from }))) {
        // utils.traceHeader(`Settling '\x1b[34m${caption}\x1b[0m':`)
      } else {
        // utils.traceHeader(`Revisiting '\x1b[34m${caption}\x1b[0m':`)
      }
      // console.info("  ", "> Routed feed ID4:            ", hash)
      console.info("  ", "> Feed solver artifact: ", `${solverArtifact.contractName}${
        solverSpecs?.parameters && solverSpecs?.parameters.length > 0
          ? `<${JSON.stringify(solverSpecs.parameters)}>` 
          : ""
      }`)
      console.info("  ", "> Feed solver deps:    ", solverSpecs?.dependencies || "(no dependencies)")
    }
    if (doSettlement) {
      if (solverArtifact.address ) {
        console.info("  ", "> Feed solver address: ", `${currentSolver[0]} => ${solverArtifact.address}`)
      }
      const tx = await feeds.settleFeedSolver(
        caption,
        solverArtifact.address,
        solverSpecs?.dependencies,
        { from }
      )
      utils.traceTx(tx.receipt)
    } else {
      console.info("  ", "> Feed solver address: ", solverArtifact.address)
    }
  } catch (ex) {
    console.info("  ", "> Exception:")
    console.info("  ", unescape(ex))
    process.exit(1)
  }
}

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toUpperCase() : word.toLowerCase();
  }).replace(/\s+/g, '');
}

function checkDepsMatchSelection(deps) {
  let match = true
  deps.map(caption => {
    const key = extractKeyFromCaption(caption)
    if (!selection.includes(key)) {
      match = false
    }
  })
  return match
}

function extractKeyFromCaption (caption) {
  let parts = caption.split("-")
  const decimals = parts[parts.length - 1]
  parts = parts[1].split("/")
  return `WitnetPriceSolver${camelize(parts[0])}${camelize(parts[1])}${decimals}`
}
