const hre = require("hardhat");
const utils = require("../utils")

module.exports = { run };

async function run(args) {

    const [ pfs, ] = await utils.getWitnetPriceFeedsContract();
    
    const sla = await pfs.defaultRadonSLA()
    
    const committeeSize = parseInt(args?.committeeSize || sla[0])
    const collateralFee = parseInt(args?.collateralFee || BigInt(sla[3]).toString())
    const witnessReward = collateralFee / 100.0;

    if (args?.collateralFee || args?.committeeSize) {
        console.info()        
        console.info("  ", "\x1b[30;48;5;208m Setting SLA...  \x1b[0m")
        const gasPrice = hre.network.config.gasPrice === "auto" 
                ? await hre.web3.eth.getGasPrice()
                : hre.network.config.gasPrice
            ;
        await pfs.settleDefaultRadonSLA([
            committeeSize,
            (witnessReward * (committeeSize + 3)).toString(),
        ], {
            gasPrice, 
            gas: 500000 
        }).wait();
        const receipt = await hre.ethers.provider.getTransactionReceipt(tx.hash) 
        utils.traceTx(receipt)

    } else {
        console.info()
        console.info("  ", "\x1b[30;48;5;13m  Default SLA    \x1b[0m")
    }
        
    console.info("  ", "- Committee size:", committeeSize)
    console.info("  ", "- Collateral fee:", (collateralFee / 10 ** 9).toFixed(1), "WIT")
    console.info("  ", "- Witness reward:", (witnessReward / 10 ** 9).toFixed(1), "WIT")
}

