const { execSync } = require("child_process")
const utils = require("../assets/witnet/utils/js")

const addresses = require("../migrations/witnet/addresses")
const templates = require("../migrations/witnet/templates")

const selection = utils.getWitnetArtifactsFromArgs()

const WitnetBytecodes = artifacts.require("WitnetBytecodes")
const WitnetRequest = artifacts.require("WitnetRequest")
const WitnetRequestTemplate = artifacts.require("WitnetRequestTemplate")

contract("migrations/witnet/templates", async () => {
  describe("My Witnet Request Templates...", async () => {
    const crafts = findWitnetRequestTemplateCrafts(templates)
    await crafts.forEach(async (craft) => {
      if (
        craft.address !== "" &&
          (
            selection.length === 0 ||
              selection.includes(craft.key)
          )
      ) {
        describe(`${craft.key}`, async () => {
          for (const test in craft.artifact?.tests) {
            describe(`${test}`, async () => {
              const args = craft.artifact.tests[test]
              it("verifiable?", async () => {
                const template = await WitnetRequestTemplate.at(craft.address)
                await template.verifyRadonRequest(args)
              })
              it("responsive?", async () => {
                const template = await WitnetRequestTemplate.at(craft.address)
                const tx = await template.buildRequest(args)
                const events = tx.logs.filter(log => log.event === "WitnetRequestBuilt")
                assert(events.length > 0, "No WitnetRequest contract was built!")
                const request = await WitnetRequest.at(events[0].args.request)
                const radHash = await request.radHash.call()
                const registry = await WitnetBytecodes.at(await request.registry.call())
                await dryRunBytecode(await registry.bytecodeOf.call(radHash))
              })
            })
          }
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

  function findWitnetRequestTemplateCrafts (tree, headers) {
    if (!headers) headers = []
    const matches = []
    for (const key in tree) {
      if (tree[key]?.retrievals || tree[key]?.aggregator || tree[key]?.tally) {
        matches.push({
          key,
          artifact: tree[key],
          address: findWitnetRequestTemplateAddress(key),
        })
      } else if (typeof tree[key] === "object") {
        matches.push(
          ...findWitnetRequestTemplateCrafts(
            tree[key],
            [...headers, key]
          )
        )
      }
    }
    return matches
  }

  function findWitnetRequestTemplateAddress (target) {
    const addrs = addresses.default?.test.templates
    for (const key in addrs) {
      if (key === target) {
        return addrs[key]
      }
    }
    return ""
  }
})
