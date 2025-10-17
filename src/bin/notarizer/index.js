const { Witnet } = require("@witnet/sdk")

require("dotenv").config()
const { Command } = require('commander');
const program = new Command();

const { assets, utils } = require("../../../dist/src/lib")
const { version } = require("../../../package.json")
const { commas } = require("../../helpers")

const WIT_CHECK_BALANCE_SECS = process.env.WITNET_PFS_CHECK_BALANCE_SECS || 900
const WIT_DRY_RUN_POLLING_SECS = process.env.WITNET_PFS_WIT_DRY_RUN_POLLING_SECS || 45
const WIT_WALLET_MASTER_KEY = process.env.WITNET_SDK_WALLET_MASTER_KEY

main()

async function main() {
    const headline = `WITNET PRICE FEEDS NOTARIZER v${version}`
    console.info("=".repeat(120))
    console.info(headline)

    program
        .name("npx witnet-pfs notarizer")
        .description("Poller bot for notarizing price feed updates in Witnet.")
        .version(version)

    program
        .option("--priority <priority>", "Network priority", process.env.WITNET_PFS_WIT_NETWORK_PRIORITY || Witnet.TransactionPriority.Medium)
        .option("--provider <url>", "Wit/RPC provider endpoint", process.env.WITNET_PFS_WIT_RPC_PROVIDER_URL || "https://rpc-testnet.witnet.io")
        .option("--signer <wit_pkh>", "Signer's public key hash", process.env.WITNET_PFS_WIT_RPC_SIGNER_PKH)
        .option("--strategy <strategy>", "UTXO selection strategy", process.env.WITNET_PFS_WTI_UTXOS_STRATEGY || Witnet.UtxoSelectionStrategy.SlimFit)
        .option("--min-balance <wits>", "Min. balance threshold", process.env.WITNET_PFS_WIT_MIN_BALANCE || 1000.0)
        .option("--min-utxos <number>", "Min. UTXOs threshold", process.env.WITNET_PFS_WIT_MIN_UTXOS || 128)
        .option("--network <evm_network>", "Focus on price feeds deployed on this EVM network", process.env.WITNET_PFS_ETH_NETWORK)
        .option("--debug", "Trace debug logs")
        .option("--witnesses <number>", "Number of witnesses required for each update", process.env.WITNET_PFS_WIT_WITNESSES)

    program.parse()
    let { debug, minBalance, minUtxos, network, priority, provider, signer, strategy, witnesses } = program.opts()
    if (!debug) console.debug = function () { }

    if (!WIT_WALLET_MASTER_KEY) {
        console.error(`❌ Fatal: a Witnet wallet's master key is not settled for this environment.`)
        process.exit(1)
    }
    const wallet = await Witnet.Wallet.fromXprv(WIT_WALLET_MASTER_KEY, {
        limit: 1,
        strategy,
        provider: await Witnet.JsonRpcProvider.fromURL(provider)
    })
    wallet.getAccount(signer || wallet.coinbase.pkh)
    signer = wallet.getSigner(signer || wallet.coinbase.pkh)
    if (!signer) {
        console.error(`❌ Fatal: hot wallet address ${WIT_SIGNER_PKH} not found in wallet!`)
        process.exit(1)
    }

    console.info(`Wit/RPC provider:  ${provider}`)
    console.info(`Witnet network:    WITNET:${wallet.provider.network.toUpperCase()} (${wallet.provider.networkId.toString(16)})`)
    console.info(`Witnet hot wallet: ${signer.pkh}`)
    console.info(`UTXOs strategy:    ${strategy.toUpperCase()}`)
    console.info(`Network priority:  ${priority.toUpperCase()}`)
    console.info(`Network witnesses: ${witnesses || "(unspecified)"}`);
    console.info(`Balance threshold: ${Witnet.Coins.fromWits(minBalance).toString(2)}`)

    const VTTs = Witnet.ValueTransfers.from(signer)
    let balance = Witnet.Coins.fromPedros(0n)
    balance = await checkWitnetBalance()
    console.info(`Initial balance:   ${balance.toString(2)} (${signer.cacheInfo.size} UTXOs)`)
    if (balance.pedros < minBalance.pedros) {
        console.error(`❌ Fatal: hot wallet must be funded with at least ${minBalance.toString(2)}.`)
        process.exit(0)
    }

    // check balance periodically
    console.info(
        `> Checking balance every ${WIT_CHECK_BALANCE_SECS || 900} seconds ...`,
    )
    setInterval(checkWitnetBalance, (WIT_CHECK_BALANCE_SECS || 900) * 1000)

    const lastUpdates = {}
    const priceFeeds = _reloadRadonRequests(network, wallet.provider.network === "mainnet")
    if (priceFeeds.length === 0) {
        console.error(`❌ Fatal: no price feeds to notarize${network ? ` on ${network.toUpperCase()}.` : "."}`)
        process.exit(1)
    }
    let maxWidth = Math.max(...Object.keys(priceFeeds).map(caption => caption.length))
    Object.entries(priceFeeds).forEach(([caption, { conditions }]) => {
        lastUpdates[caption] = { value: 0, timestamp: 0}
        console.info(
            `> ${caption}${" ".repeat(maxWidth - caption.length)}: { deviation: ${
            conditions.deviationPercentage.toFixed(1)
            } %, heartbeat: ${
            commas(conditions.heartbeatSecs)
            } " }`)
        notarize(caption)
    })

    async function notarize(caption) {
        // const clock = Date.now()
        const { request, conditions } = priceFeeds[caption]
        const tag = `${caption}${" ".repeat(maxWidth - caption.length)}`

        try {
            let dryrun = JSON.parse(await request.execDryRun())
            if (!Object.keys(dryrun).includes("RadonInteger")) {
                throw `Error: unexpected dry run result: ${dryrun}`
            } else {
                dryrun = parseInt(dryrun.RadonInteger)
            }

            // determine whether a new notarization is required
            const heartbeatSecs = Math.floor(Date.now() / 1000) - lastUpdates[caption].timestamp
            if (heartbeatSecs < conditions.heartbeatSecs / 2) {    
                const deviation = (
                    lastUpdates[caption].value > 0 
                        ? 100 * (dryrun - lastUpdates[caption].value) / lastUpdates[caption].value
                        : 0
                );
                if (Math.abs(deviation) < conditions.deviationPercentage) {
                    throw `${deviation >= 0 ? "+" : ""}${deviation.toFixed(2)} % deviation after ${heartbeatSecs} secs.`
                } else {
                    console.info(`[${tag}] Updating due to price deviation of ${deviation.toFixed(2)} % ...`)
                }
            } else {
                console.info(`[${tag}] Updating due to heartbeat after ${heartbeatSecs} secs ...`)
            }

            // create, sign and send new data request transaction
            const DRs = Witnet.DataRequests.from(signer, request)
            let tx = await DRs.sendTransaction({ witnesses })
            console.info(`[${tag}] Witnesses  =>`, tx.witnesses)
            console.info(`[${tag}] RAD hash   =>`, tx.radHash)
            console.info(`[${tag}] DRT hash   =>`, tx.hash)
            console.info(`[${tag}] DRT cost   =>`, Witnet.Coins.fromNanowits(tx.fees.nanowits + tx.value?.nanowits).toString(2))

            // await inclusion in Witnet
            tx = await DRs.confirmTransaction(tx.hash, {
                onStatusChange: () => console.info(`[${tag}] DRT status =>`, tx.status)
            }).catch(err => { throw err })

            // await resolution in Witnet
            let status = tx.status
            do {
                const report = await wallet.provider.getDataRequest(tx.hash, "ethereal")
                if (report.status !== status) {
                    status = report.status
                    console.info(`[${tag}] DRT status =>`, report.status)
                }
                if (report.status === "solved" && report?.result) {
                    const result = utils.cbor.decode(utils.fromHexString(report.result.cbor_bytes))
                    if (Number.isInteger(result)) {
                        lastUpdates[caption].timestamp = report.result.timestamp
                        lastUpdates[caption].value = parseInt(result)
                        console.info(`[${tag}] DRT result =>`, lastUpdates[caption])
                    } else {
                        throw `Unexpected DRT result => ${result}`
                    }
                    break
                }
                const delay = ms => new Promise(_resolve => setTimeout(_resolve, ms))
                await delay(5000)
            } while (status !== "solved")

        } catch (err) {
            console.warn(`[${tag}] ${err}`)
        } 
        setTimeout(() => notarize(caption), WIT_DRY_RUN_POLLING_SECS * 1000)
    }

    async function checkWitnetBalance() {
        let newBalance = Witnet.Coins.fromPedros((await signer.getBalance()).unlocked)
        const now = Math.floor(Date.now() / 1000)
        const increased = newBalance.nanowits > balance?.nanowits || 0n
        const utxos = (await signer.getUtxos(increased)).filter(utxo => utxo.timelock <= now)
        if (increased && utxos.length < minUtxos) {
            const totalSplits = minUtxos
            const iters = BigInt(Math.ceil(totalSplits / 32))
            let remaining = totalSplits
            for (let ix = 0; ix < iters; ix++) {
                const splits = Math.min(remaining, 32)
                remaining -= splits;
                let fees = 10000n
                const recipients = []
                const value = Witnet.Coins.fromPedros((newBalance.pedros / iters - fees * iters) / BigInt(splits))
                fees += (newBalance.pedros / iters - fees * iters) % BigInt(splits)
                recipients.push(...Array(splits).fill([signer.pkh, value]))
                const receipt = await VTTs.sendTransaction({ recipients, fees: Witnet.Coins.fromPedros(fees) })
                console.info(JSON.stringify(receipt.tx, utils.txJsonReplacer, 4))
                await VTTs.confirmTransaction(receipt.hash, {
                    onStatusChange: (receipt) => { console.info(`> Splitting UTXOs => ${receipt.hash} [${receipt.status}]`) },
                })
                newBalance = Witnet.Coins.fromPedros((await signer.getBalance()).unlocked)
            }
        }
        return newBalance
    }
}

function _reloadRadonRequests(network, mainnets) {
    const captions = []
    const priceFeeds = utils.getNetworkPriceFeeds(network)
    return Object.fromEntries(
        priceFeeds.requests
        .map(caption => {
            captions.push(caption)
            const artifact = utils.captionToWitOracleRequestPrice(caption)
            let request
            try {
                request = utils.requireRadonRequest(artifact, assets)
            } catch (err) {
                console.error(`❌ Fatal: cannot load Radon Request for artifact ${artifact} (${caption}):\n${err}`)
                process.exit(1)
            }
            const conditions = utils.getPriceFeedUpdateConditions(caption, mainnets)
            const networks = utils.getPriceFeedNetworks(caption, mainnets)
            return [
                caption,
                { artifact, request, conditions, networks, lastUpdate: {} }
            ]
        })
        .filter(([, { request, networks }]) => request !== undefined && networks.length > 0)
        .filter(([caption], index) => captions.indexOf(caption) === index)
        .sort(([a], [b]) => a.localeCompare(b))
    )
}
