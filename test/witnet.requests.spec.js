const WitnetRequest = artifacts.require("WitnetRequest")

const { execSync } = require("child_process")
const addresses = require("../migrations/witnet/addresses")
const requests = require("../migrations/witnet/requests")

contract("migrations/witnet/requests", async () => {
  describe("My Witnet Requests...", async () => {
    const crafts = findWitnetRequestCrafts(requests)
    crafts.forEach(async (craft) => {
      if (craft.address !== "") {
        describe(`${craft.artifact}`, async () => {
          it("verified?", async () => {
            const request = await WitnetRequest.at(craft.address)
            await request.radHash.call()
          })
          it("securable?", async () => {
            const request = await WitnetRequest.at(craft.address)
            await request.settleRadonSLA([3, 51, "100000000", "1000000000", "10000000"])
          })
          it("responsive?", async () => {
            const request = await WitnetRequest.at(craft.address)
            const tx = await request.settleRadonSLA([3, 51, "100000000", "1000000000", "10000000"])
            const logs = tx.logs.filter(log => log.event === "WitnetRequestSettled")
            const secured = await WitnetRequest.at(logs[0].args.request)
            const bytecode = await secured.bytecode.call()
            assert(bytecode, `${craft.artifact}: has no RadonSLA`)
            await dryRunBytecode(bytecode)
          })
        })
      }
    })
  })

  async function dryRunBytecode (bytecode) {
    const output = (await execSync(`npx witnet-toolkit try-query --hex ${bytecode}`)).toString()
    console.log(output)
    const errors = (await execSync(
      `npx witnet-toolkit try-query --hex ${bytecode} | grep Error | wc -l`
    )).toString().split("\n")[0]
    if (errors !== "0") {
      throw output
    }
  }

  function findWitnetRequestCrafts (tree, headers) {
    if (!headers) headers = []
    const matches = []
    for (const key in tree) {
      if (tree[key]?.retrievals || tree[key]?.template) {
        matches.push({
          artifact: key,
          address: findWitnetRequestAddress(key),
        })
      } else if (typeof tree[key] === "object") {
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

  function findWitnetRequestAddress (target) {
    const addrs = addresses.default?.test.requests
    for (const key in addrs) {
      if (key === target) {
        return addrs[key]
      }
    }
    return ""
  }
})
