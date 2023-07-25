require("dotenv").config()

const addresses = require("../../witnet/addresses")
const utils = require("../../../assets/witnet/utils/js")

const WitnetPriceFeeds = artifacts.require("WitnetPriceFeeds")

module.exports = async function (_deployer, network, [, from]) {
    const pfs = await WitnetPriceFeeds.deployed()
    const sla = await pfs.defaultRadonSLA.call({ from })
    let changes = false
    process.argv.map((argv, index, args) => {
        if (argv === "--num-witnesses") {
            sla.numWitnesses = parseInt(args[index + 1])
            changes = true
        } else if (argv === "--min-consensus-percentage") {
            sla.minConsensusPercentage = parseInt(args[index + 1])
            changes = true
        } else if (argv === "--witness-reward") {
            sla.witnessReward = args[index + 1]
            changes = true
        } else if (argv === "--witness-collateral") {
            sla.witnessCollateral = args[index + 1]
            changes = true
        } else if (argv === "--commit-reveal-fee") {
            sla.minerCommitRevealFee = args[index + 1]
            changes = true
        }
        return argv
    })
    console.log("> numWitnesses:          ", sla.numWitnesses)
    console.log("> minConsensusPercentage:", sla.minConsensusPercentage, "%")
    console.log("> witnessReward:         ", sla.witnessReward / 10 ** 9, "WIT" )
    console.log("> witnessCollateral:     ", sla.witnessCollateral / 10 ** 9, "WIT" )
    console.log("> minerCommitRevealFee:  ", sla.minerCommitRevealFee / 10 ** 9, "WIT" )
    if (changes) {
        let answer = (await utils.prompt(`\nSettle new price update SLA? [y/N] `)).toLowerCase().trim()
        if (["y", "yes"].includes(answer)) {
            const tx = await pfs.settleDefaultRadonSLA(sla, { from })
            utils.traceTx(tx.receipt)
            tx.logs.map(log => console.log(`  => ${log.event}(${JSON.stringify(log.args)})`))
        }
    }
}