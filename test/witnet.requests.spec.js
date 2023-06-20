const { execSync } = require("child_process")
const utils = require("../assets/witnet/utils/js")

const addresses = require("../migrations/witnet/addresses")
const requests = require("../migrations/witnet/requests")

const selection = utils.getWitnetArtifactsFromArgs()

const WitnetBytecodes = artifacts.require("WitnetBytecodes")
const WitnetRequest = artifacts.require("WitnetRequest")

contract("migrations/witnet/requests", async () => {
  describe("My Witnet Requests...", async () => {
    const crafts = findWitnetRequestCrafts(requests)
    crafts.forEach(async (craft) => {
      if (
        craft.address !== "" &&
          (
            selection.length === 0 ||
              selection.includes(craft.artifact)
          )
      ) {
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
            const registry = await WitnetBytecodes.at(await request.registry.call())
            const bytecode = await registry.bytecodeOf.call(await request.radHash.call())
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
