const exec = require("child_process").execSync

const WitnetRequest = artifacts.require("WitnetRequest")

const { execSync } = require("child_process")
const addresses = require("../migrations/witnet/addresses")
const requests = require("../migrations/witnet/requests")

contract("migrations/witnet/requests", async () => {
  
  describe("My Witnet Requests...", async () => {
    var crafts = findWitnetRequestCrafts(requests)
    crafts.forEach(async (craft) => {
      describe(`${craft.artifact}`, async () => {
        it(`verified?`, async () => {
          var request = await WitnetRequest.at(craft.address)
          await request.radHash.call()
        })
        it("securable?", async () => {
          var request = await WitnetRequest.at(craft.address)
          await request.settleRadonSLA([ 3, 51, "100000000", "1000000000", "10000000" ])
        })
        it(`responsive?`, async () => {
          var request = await WitnetRequest.at(craft.address)
          var tx = await request.settleRadonSLA([ 3, 51, "100000000", "1000000000", "10000000" ])
          var logs = tx.logs.filter(log => log.event === 'WitnetRequestSettled')
          var secured = await WitnetRequest.at(logs[0].args.request)
          var bytecode = await secured.bytecode.call()
          assert(bytecode, `${craft.artifact}: has no RadonSLA`)
          await dryRunBytecode(bytecode)
        })
      })
    })
  })

  async function dryRunBytecode(bytecode) {
    let output = (await execSync(`npx witnet-toolkit try-query --hex ${bytecode}`)).toString()
    console.log(output)
    let errors = (await execSync(`npx witnet-toolkit try-query --hex ${bytecode} | grep Error | wc -l`)).toString().split("\n")[0]
    if (errors !== "0") {
      throw output
    }
  }

  function findWitnetRequestCrafts(tree, headers) {
    if (!headers) headers = []
    var matches = []
    for (const key in tree) {
      if (tree[key]?.retrievals || tree[key]?.template) {
        matches.push({
          artifact: key,
          address: findWitnetRequestAddress(key)
        })
      } else if (typeof tree[key] === 'object') {
        matches.push(
          ...findWitnetRequestCrafts(
            tree[key], 
            [...headers, key]
          )
        )
      }
    }
    return matches
  }

  function findWitnetRequestAddress(target) {
    var addrs = addresses.default?.test.requests
    for (const key in addrs) {
      if (key === target) {
        return addrs[key]
      }
    }
    throw `Cannot find address for ${target}`
  }
})