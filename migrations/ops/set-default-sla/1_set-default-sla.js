require("dotenv").config()

const addresses = require("../../witnet/addresses")
const utils = require("../../../assets/witnet/utils/js")

const WitnetPriceFeeds = artifacts.require("WitnetPriceFeeds")

module.exports = async function (_deployer, network, [, from]) {
    const pfs = await WitnetPriceFeeds.deployed()
    const oldSLA = await pfs.defaultRadonSLA.call({ from })
    let newSLA = { ...oldSLA }
    process.argv.map((argv, index, args) => {
        if (argv === "--num-witnesses") {
            newSLA.numWitnesses = args[index + 1]
        } else if (argv === "--min-consensus-percentage") {
            newSLA.minConsensusPercentage = args[index + 1]
        } else if (argv === "--witness-reward") {
            newSLA.witnessReward = args[index + 1]
        } else if (argv === "--witness-collateral") {
            newSLA.witnessCollateral = args[index + 1]
        } else if (argv === "--commit-reveal-fee") {
            newSLA.minerCommitRevealFee = args[index + 1]
        }
        return argv
    })
    console.log("> numWitnesses:          ", `${oldSLA.numWitnesses} ${newSLA.numWitnesses !== oldSLA.numWitnesses ? `=> ${newSLA.numWitnesses}` : ""}`)
    console.log("> minConsensusPercentage:", `${oldSLA.minConsensusPercentage} % ${newSLA.minConsensusPercentage !== oldSLA.minConsensusPercentage ? `=> ${newSLA.minConsensusPercentage} %` : ""}`)
    console.log("> witnessReward:         ", `${oldSLA.witnessReward / 10 ** 9} WIT ${newSLA.witnessReward !== oldSLA.witnessReward ? `=> ${newSLA.witnessReward / 10 ** 9} WIT` : ""}`)
    console.log("> witnessCollateral:     ", `${oldSLA.witnessCollateral / 10 ** 9} WIT ${newSLA.witnessCollateral !== oldSLA.witnessCollateral ? `=> ${newSLA.witnessCollateral / 10 ** 9} WIT` : ""}`)
    console.log("> minerCommitRevealFee:  ", `${oldSLA.minerCommitRevealFee / 10 ** 9} WIT ${newSLA.minerCommitRevealFee !== oldSLA.minerCommitRevealFee ? `=> ${newSLA.witnessCollateral / 10 ** 9} WIT` : ""}`)
    let answer = (await utils.prompt(`\nSettle new SLA for price updates? [y/N] `)).toLowerCase().trim()
    if (["y", "yes"].includes(answer)) {
        const tx = await pfs.settleDefaultRadonSLA(newSLA, { from })
        utils.traceTx(tx.receipt)
        tx.logs.map(log => console.log(`  => ${log.event}(${JSON.stringify(log.args)})`))
    }
}