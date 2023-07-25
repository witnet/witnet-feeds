const addresses = require("../../witnet/addresses")

const WitnetPriceFeeds = artifacts.require("WitnetPriceFeeds")

module.exports = async function (_deployer, network, [, from]) {
    const pfs = await WitnetPriceFeeds.deployed()
    const sla = await pfs.defaultRadonSLA.call({ from })
    console.log("> numWitnesses:          ", sla.numWitnesses)
    console.log("> minConsensusPercentage:", sla.minConsensusPercentage, "%")
    console.log("> witnessReward:         ", sla.witnessReward / 10 ** 9, "WIT" )
    console.log("> witnessCollateral:     ", sla.witnessCollateral / 10 ** 9, "WIT" )
    console.log("> minerCommitRevealFee:  ", sla.minerCommitRevealFee / 10 ** 9, "WIT" )
}