const hre = require("hardhat")
const utils = require("../utils")

module.exports = { run }

async function run (args) {
  const todo = args.captions?.map(caption => {
    return "Price-" + caption.toUpperCase()
  }) || []

  const [pfs] = await utils.getWitPriceFeedsContract(args?.from)
  const feeds = await pfs.supportedFeeds()

  const caps = []; const id4s = []; const rads = []
  feeds[0].forEach((id4, index) => {
    id4s.push(id4)
    caps.push(feeds[1][index])
    rads.push(feeds[2][index])
  })
  const oixs = [...caps].sort().map(caption => feeds[1].indexOf(caption))

  let status = []
  try {
    status = await pfs.latestPrices(id4s)
  } catch {
    id4s.forEach(() => status.push([
      BigInt("0"),
      BigInt("0"),
      "",
      BigInt("0"),
    ]))
  }

  for (const index in caps) {
    if (
      todo.length > 0 &&
            !todo.includes(caps[oixs[index]])
    ) continue

    if (rads[oixs[index]].endsWith("000000000000000000000000")) {
      const solver = await pfs.lookupPriceSolver(id4s[oixs[index]])
      const solverAddr = solver[0]
      const solverDeps = solver[1]
      const solverContract = await utils.getWitPriceFeedsSolverContract(solverAddr)
      const solverClass = await solverContract.class()
      utils.traceWitnetPriceSolver(
        caps[oixs[index]],
        id4s[oixs[index]],
        solverAddr,
        solverClass,
        solverDeps,
        parseInt(BigInt(status[oixs[index]][1]).toString()),
      )
      continue
    } else {
      const bytecode = await pfs.lookupWitOracleRequestBytecode(id4s[oixs[index]])
      const livePrice = JSON.parse(await utils.dryRunBytecode(bytecode.slice(2)))?.tally?.result
      await utils.traceWitnetPriceFeed(
        pfs,
        caps[oixs[index]],
        id4s[oixs[index]],
        rads[oixs[index]],
        status[oixs[index]],
        livePrice
      )
    }
    if (args.updateForce || args.update) {
      const gasPrice = hre.network.config.gasPrice === "auto"
        ? await hre.web3.eth.getGasPrice()
        : hre.network.config.gasPrice

      const balance = BigInt(await hre.ethers.provider.getBalance(pfs.runner.address))
      const updateFee = (await pfs["estimateUpdateRequestFee(uint256)"](gasPrice))
      process.stdout.write(`   > Requesting update (fee: ${parseFloat(updateFee.toString()) / 10 ** 18})... `)
      const tx = await pfs["requestUpdate(bytes4)"](id4s[oixs[index]], {
        gasLimit: null,
        gasPrice,
        value: updateFee,
      })
      process.stdout.write(`${tx.hash} ... `)
      await tx.wait()
      const queryId = await pfs.latestUpdateQueryId(id4s[oixs[index]])
      process.stdout.write(`witnetQuery => #\x1b[33m${queryId}\x1b[0m\n`)
      const receipt = await hre.ethers.provider.getTransactionReceipt(tx.hash)
      utils.traceTx(receipt, balance - BigInt(await hre.ethers.provider.getBalance(pfs.runner.address)))
    }
  }
  console.info()
}
