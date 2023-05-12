require("dotenv").config()

const fs = require("fs")
const readline = require("readline")
const web3 = require("web3")

module.exports = {
  findRadonRetrievalSpecs,
  fromAscii,
  getRealmNetworkFromArgs,
  getRealmNetworkFromString,
  getRequestMethodString,
  getRequestResultDataTypeString,
  getWitnetRequestArtifactsFromArgs,
  isNullAddress,
  padLeft,
  prompt,
  saveAddresses,
  saveHashes,
  buildWitnetRequestFromTemplate,
  traceHeader,
  verifyWitnetRadonReducerByTag,
  verifyWitnetRadonRetrievalByTag,
}

function findRadonRetrievalSpecs(retrievals, tag, headers) {
  if (!headers) headers = []
  for (const key in retrievals) {
    if (typeof retrievals[key] === 'object') {
      var retrieval = retrievals[key]
      if (key === tag || key === retrieval?.alias) {
        if (retrieval.requestScript) {
          if (typeof retrieval.requestScript === 'object') {
            retrieval.requestScript = "0x" + retrieval.requestScript.encode().toString('hex')
          }
          if (retrieval?.requestMethod !== 2) {
            if (!retrieval?.requestAuthority) {
              retrieval.requestAuthority = headers[headers.length - 1]
            }
            if (!retrieval?.requestPath) {
              retrieval.requestPath = tag
            }
          }
          return retrieval
        } else {
          throw `Witnet Radon Retrieval found with no script: '${key}'`
        }
      } else {
        retrieval = findRadonRetrievalSpecs(retrievals[key], tag, [...headers, key])
        if (retrieval) {
          return retrieval
        }
      }
    }
  }
}

function fromAscii(str) {
  const arr1 = []
  for (let n = 0, l = str.length; n < l; n++) {
    const hex = Number(str.charCodeAt(n)).toString(16)
    arr1.push(hex)
  }
  return "0x" + arr1.join("")
}

function getRealmNetworkFromArgs() {
  let networkString = process.argv.includes("test") ? "test" : "development"
  // If a `--network` argument is provided, use that instead
  const args = process.argv.join("=").split("=")
  const networkIndex = args.indexOf("--network")
  if (networkIndex >= 0) {
    networkString = args[networkIndex + 1]
  }
  return getRealmNetworkFromString(networkString)
}

function getRealmNetworkFromString(network) {
  network = network ? network.toLowerCase() : "development"

  // Try to extract realm/network info from environment
  const envRealm = process.env.WITNET_EVM_REALM
    ? process.env.WITNET_EVM_REALM.toLowerCase()
    : null

  let realm
  if (network.split(".")[1]) {
    realm = network.split(".")[0]
    if (realm === "ethereum") {
      // Realm in "ethereum.*" networks must be set to "default"
      realm = "default"
    }
    if (envRealm && realm !== envRealm) {
      // Check that WITNET_EVM_REALM, if defined, and network's realm actually match
      console.error(
        `\n> Fatal: network "${network}" and WITNET_EVM_REALM value`,
        `("${envRealm.toUpperCase()}") don't match.\n`
      )
      process.exit(1)
    }
  } else {
    realm = envRealm || "default"
    network = `${realm === "default" ? "ethereum" : realm}.${network}`
  }
  if (realm === "default") {
    const subnetwork = network.split(".")[1]
    if (subnetwork === "development" || subnetwork === "test") {
      // In "default" realm, networks "development" and "test" must be returned without a prefix.
      network = subnetwork
    }
  }
  return [realm, network]
}

function getWitnetRequestArtifactsFromArgs() {
  let selection = []
  process.argv.map((argv, index, args) => {
    if (argv === "--requests") {
      selection = args[index + 1].split(",")
    }
    return argv
  })
  return selection
}

function getRequestMethodString(method) {
  if (method == 0) {
    return "UNKNOWN"
  } else if (method == 1 || !method) {
    return "HTTP-GET"
  } else if (method == 2) {
    return "RNG"
  } else if (method == 3) {
    return "HTTP-POST"
  } else {
    return method.toString()
  }
}

function getRequestResultDataTypeString(type) {
  if (type == 1) {
    return "Array"
  } else if (type == 2) {
    return "Bool"
  } else if (type == 3) {
    return "Bytes"
  } else if (type == 4) {
    return "Integer"
  } else if (type == 5) {
    return "Float"
  } else if (type == 6) {
    return "Map"
  } else if (type == 7) {
    return "String"
  } else {
    return "(Undetermined)"
  }
}

function isNullAddress(addr) {
  return !addr ||
    addr === "0x0000000000000000000000000000000000000000" ||
    !web3.utils.isAddress(addr)
}

function padLeft(str, char, size) {
  if (str.length < size) {
    return char.repeat((size - str.length) / char.length) + str
  } else {
    return str
  }
}

async function prompt(text) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  let answer
  await new Promise((resolve) => {
    rl.question(
      text,
      function (input) {
        answer = input
        rl.close()
      })
    rl.on("close", function () {
      resolve()
    })
  })
  return answer
}

function saveAddresses(addrs, path) {
  fs.writeFileSync(
    `${path || './migrations/witnet'}/addresses.json`,
    JSON.stringify(addrs, null, 4),
    { flag: 'w+' }
  )
}

function saveHashes(hashes, path) {
  fs.writeFileSync(
    `${path || './migrations/witnet'}/hashes.json`,
    JSON.stringify(hashes, null, 4),
    { flag: 'w+' }
  )
}

async function buildWitnetRequestFromTemplate(from, contract, args) {
  // convert all args values to string
  args = args.map(subargs => subargs.map(v => v.toString()))
  var tx = await contract.buildRequest(args, { from })
  var requestAddress = tx.logs[0].args.request
  console.info("  ", "> settlement hash:", tx.receipt.transactionHash)
  console.info("  ", "> settlement gas: ", tx.receipt.gasUsed)
  console.info("  ", "> request address:", requestAddress)
  console.info("  ", "> request radhash:", tx.logs[0].args.radHash)
  return requestAddress
}

function traceHeader(header) {
  console.log("")
  console.log("  ", header)
  console.log("  ", `${"-".repeat(header.length)}`)
}

async function verifyWitnetRadonReducerByTag(from, registry, radons, tag) {
  var reducer = radons?.reducers[tag]
  var hash
  if (reducer) {
    // get actual reducer hash
    hash = await registry.verifyRadonReducer.call([
        reducer.opcode,
        reducer.filters || [],
        reducer.script || "0x"
      ], { from }
    )
    // checks whether hash was already registered
    try {
      await registry.lookupRadonReducer.call(hash, { from })
    } catch {
      // register new reducer, otherwise:
      traceHeader(`Verifying radon reducer ['${tag}']...`)
      console.info(`   > Reducer opcode:      ${reducer.opcode}`)
      if (reducer.filters) {
        reducer.filters = reducer.filters.map(filter => [ 
          filter.opcode, 
          "0x" + filter.args.toString("hex")
        ])
      }
      console.info(`   > Reducer filters:     ${reducer.filters?.length > 0 ? JSON.stringify(reducer.filters) : '(no filters)'}`)
      if (reducer.script) {
        console.info(`   > Reducer script:      ${reducer.script}`)
      }
      const tx = await registry.verifyRadonReducer([
          reducer.opcode,
          reducer.filters || [],
          reducer.script || "0x",
        ], { from }
      )
      console.info(`   > transaction hash:    ${tx.receipt.transactionHash}`)
      console.info(`   > gas used:            ${tx.receipt.gasUsed}`)
      hash = tx.logs[tx.logs.length - 1].args.hash
      console.info(`   > radon reducer hash:  ${hash}`)
    }
  } else {
    throw `Witnet Radon Reducer not found: '${tag}'`
  }
  return hash
}

async function verifyWitnetRadonRetrievalByTag(from, registry, radons, tag) {
  const retrieval = findRadonRetrievalSpecs(radons?.retrievals, tag)
  // get actual hash for this data source
  var hash
  if (retrieval) {
    // var requestScriptBytecode
    // if (retrieval.requestScript === 'object') {
    //   requestScriptBytecode = "0x" + retrieval.requestScript.encode().toString('hex')
    // }
    try {
      hash = await registry.verifyRadonRetrieval.call(
        await retrieval.requestMethod || 1,
        retrieval.requestSchema || "",
        retrieval.requestAuthority || "",
        retrieval.requestPath || "",
        retrieval.requestQuery || "",
        retrieval.requestBody || "",
        retrieval.requestHeaders || [],
        retrieval.requestScript || "0x80",
        { from }
      )
    } catch (e) {
      console.log(retrieval.requestScript)
      console.log(e)
      throw e
    }
    // checks whether hash is already registered
    try {
      await registry.lookupRadonRetrieval.call(hash, { from })
    } catch (ex) {
      // register new retrieval, otherwise:
      traceHeader(`Verifying radon retrieval ['${tag}']...`)
      console.info(`   > Request method:    ${getRequestMethodString(await retrieval.requestMethod)}`)
      if (retrieval.requestSchema) {
        console.info(`   > Request schema:    ${retrieval.requestSchema}`)
      }
      if (retrieval.requestAuthority) {
        console.info(`   > Request authority: ${retrieval.requestAuthority}`)
      }
      if (retrieval.requestPath)  {
        console.info(`   > Request path:      ${retrieval.requestPath}`)
      }
      if (retrieval.requestQuery) {
        console.info(`   > Request query:     ${retrieval.requestQuery}`)
      }
      if (retrieval.requestBody) {
        console.info(`   > Request body:      ${retrieval.requestBody}`)
      }
      if (retrieval.requestHeaders) {
        console.info(`   > Request headers:   ${retrieval.requestHeaders}`)
      }
      console.info(`   > Request script:    ${retrieval.requestScript/*?.script*/ || "0x80"}`)
      const tx = await registry.verifyRadonRetrieval(
        retrieval.requestMethod || 1,
        retrieval.requestSchema || "",
        retrieval.requestAuthority || "",
        retrieval.requestPath || "",
        retrieval.requestQuery || "",
        retrieval.requestBody || "",
        retrieval.requestHeaders || [],
        retrieval.requestScript || "0x80",
        { from }
      )
      console.info(`   > transaction hash:  ${tx.receipt.transactionHash}`)
      console.info(`   > transaction gas:   ${tx.receipt.gasUsed}`)
      var logs = tx.logs.filter(log => log.event === 'NewRadonRetrievalHash')
      hash = logs[0].args.hash
      console.info(`   > radon retrieval hash: ${hash}`)
    }
  } else {
    throw `Witnet Radon Retrieval not found: '${tag}`
  }
  return hash
}