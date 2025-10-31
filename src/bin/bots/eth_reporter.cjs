const { Witnet } = require("@witnet/sdk")
const { ethers, WitOracle } = require("@witnet/solidity")

const cron = require("node-cron")
require("dotenv").config()
const { Command } = require('commander');
const program = new Command();

const { utils, Rulebook } = require("../../../dist/src/lib")
const { version } = require("../../../package.json")
const { commas } = require("../../helpers")

const CHECK_BALANCE_SCHEDULE = process.env.WITNET_PFS_CHECK_BALANCE_SCHEDULE || "*/5 * * * *"
const DRY_RUN_POLLING_SECS = process.env.WITNET_PFS_DRY_RUN_POLLING_SECS || 45

let balance, footprint, priceFeeds = [], maxCaptionWidth
let pendingUpdates = []
let rulebook

main()

async function main() {
    const headline = `WITNET PRICE FEEDS REPORTER v${version}`
    console.info("=".repeat(120))
    console.info(headline)

    program
        .name("node src/bin/reporter")
        .description("Poller bot for reporting price feed updates into a WitPriceFeeds target.")
        .version(version)

    program
        .option("--config-path <path>", "URL or file subpath where to locate rulebook JSON files")
        .option("--debug", "Trace debug logs")
        .option("--gas-limit <gas>", "Max. gas to spend upon updates", process.WITNET_PFS_ETH_GAS_LIMIT)
        .option("--host <url>", "ETH/RPC provider host", process.env.WITNET_PFS_ETH_RPC_PROVIDER_HOST || "http://127.0.0.1")
        .option("--port <url>", "ETH/RPC provider port", process.env.WITNET_PFS_ETH_RPC_PROVIDER_PORT || 8545)
        .option("--kermit <url>", "WIT/Kermit endpoint other than default", "https://kermit.witnet.io")
        .option("--min-balance <eth>", "Min. balance threshold", process.env.WITNET_PFS_ETH_MIN_BALANCE || 0.001)
        .option("--max-gas-price <gwei>", "Max. network gas price to pay upon updates", process.env.WITNET_PFS_ETH_MAX_GAS_PRICE)
        .option("--network <evm_network>", "EVM network to report into", process.env.WITNET_PFS_ETH_NETWORK)
        .option("--signer <evm_address>", "EVM address that pays for reporting updates")
        .option("--target <evm_address>", "WitPriceFeeds address to report into")
        .option("--witnet <url>", "WIT/RPC provider", process.env.WITNET_PFS_WIT_RPC_PROVIDER)
        
    program.parse()

    let { 
        configPath, 
        debug, 
        gasLimit, 
        host, 
        kermit, 
        minBalance, 
        maxGasPrice, 
        network, 
        port, 
        signer, 
        target, 
        witnet,
    } = program.opts()

    if (!debug) console.debug = function () { }


    if (!signer || !ethers.isAddress(signer)) {
        console.error(`❌ Fatal: invalid EVM signer address: "${signer}"`)
        process.exit(0)
    } else if (!target || !ethers.isAddress(target)) {
        console.error(`❌ Fatal: invalid EVM target address: "${target}"`)
        process.exit(0)
    }

    const witOracle = await WitOracle
        .fromJsonRpcUrl(`${host}:${port}`, signer)
        .catch(err => {
            console.error(`❌ Fatal: ${err}`)
            process.exit(0)
        });

    if (network && witOracle.network !== network) {
        console.error(`❌ Fatal: connected to ${witOracle.network.toUpperCase()} instead of ${network.toUpperCase()}`)
        process.exit(0)
    } else {
        network = witOracle.network
    }

    const witOracleRadonRegistry = await witOracle
        .getWitOracleRadonRegistry()
        .catch(err => {
            console.error(`❌ Fatal: cannot fetch Wit/Oracle Radon Registry: ${err}`)
            process.exit(0)
        })

    const _witnet = await Witnet.JsonRpcProvider.fromURL(witnet || (
        utils.isEvmNetworkMainnet(network) ? "https://rpc-02.witnet.io" : "https://rpc-testnet.witnet.io"
    ))
    const _kermit = await Witnet.KermitClient.fromEnv(kermit)

    console.info(`WIT/Kermit URL:   ${_kermit.url}`)
    console.info(`WIT/RPC provider: ${_witnet.endpoints}`)
    console.info(`EVM RPC gateway:  ${host}:${port}`)
    console.info(`EVM network:      ${network.toUpperCase()}`)

    const witPriceFeeds = await witOracle
        .getWitPriceFeedsAt(target)
        .catch(err => {
            console.error(`❌ Fatal: ${err}`)
            process.exit(0)
        })

    const [ artifact, serial ] = await Promise.all([
        witPriceFeeds.getEvmImplClass(),
        witPriceFeeds.getEvmImplVersion(),
    ])
    if (!artifact.startsWith("WitPriceFeeds")) {
        console.error(`❌ Fatal: invalid target artifact: ${target}`)
        process.exit(0)
    } else if (!serial.startsWith("3.")) {
        console.error(`❌ Fatal: unsupported WitPriceFeeds version: ${serial}`)
        process.exit(0)
    }

    console.info(`Wit/Oracle bridge:    ${witOracle.address}`)
    console.info(`Wit/Oracle registry:  ${witOracleRadonRegistry.address}`)
    console.info(`Wit/Oracle appliance: ${target} [${artifact} v${serial.split("-")[0]}]`)

    const { provider } = witOracle
    const symbol = utils.getEvmNetworkSymbol(network)
    balance = await provider.getBalance(signer)
    minBalance = BigInt(minBalance * 1e18)

    console.info(`[${signer}] Balance threshold: ${ethers.formatEther(minBalance)} ${symbol}`)
    console.info(`[${signer}] Initial balance:   ${ethers.formatEther(balance)} ${symbol}`)

    if (balance < BigInt(minBalance)) {
        console.error(`❌ Fatal: the signer address must be funded with at least ${minBalance} ${symbol}`)
        process.exit(0)
    } else {
        if(!cron.validate(CHECK_BALANCE_SCHEDULE)) {
            console.error(`❌ Fatal: invalid check balance schedule: ${CHECK_BALANCE_SCHEDULE}`)
            process.exit(0)
        }
        console.info(`[${signer}] Checking balance schedule: ${CHECK_BALANCE_SCHEDULE}`)
        cron.schedule(CHECK_BALANCE_SCHEDULE, async () => checkBalance())
    }

    console.info(`[${witPriceFeeds.address}] Purging pending updates every ${DRY_RUN_POLLING_SECS} seconds ...`)
    setInterval(purgePendingUpdates, DRY_RUN_POLLING_SECS * 1000)

    await lookupPriceFeeds()

    async function checkBalance() {
        // check balance
        try {
            const newBalance = await provider.getBalance(signer)
            if (newBalance > balance) {
                console.info(`[${network}:${signer}] Balance increased +${ethers.formatEther(newBalance - balance)} ${symbol}`)
            }
            balance = newBalance
        } catch (err) {
            console.warn(`[${network}:${signer}] Cannot check balance: ${err}`)
        }
        
        console.info(`[${network}:${signer}] Balance: ${ethers.formatEther(balance)} ${symbol}`)
        if (balance < minBalance) {
            console.warn(`[${network}:${signer}] Low funds !!!`)
        }
        await lookupPriceFeeds()
    }

    async function lookupPriceFeeds() {
        // try to reload deviations thresholds, which are not stored on-chain but only in the book of rules
        try {
            const newRulebook = configPath ? await Rulebook.fromUrlBase(configPath) : Rulebook.default()
            rulebook = newRulebook
            console.debug(`[${network}:${signer}] Reloaded deviation threshold rules.`)
        } catch (err) {
            console.warn(`[${network}:${signer}] Cannot reload Rulebook: ${err}`)
        }
        // check footprint
        try {
            const newFootprint = await witPriceFeeds.getEvmFootprint()
            if (newFootprint !== footprint) {
                footprint = newFootprint
                console.info(`[${witPriceFeeds.address}] Price feeds footprint changed to ${footprint}:`)
                
                const pfs = await witPriceFeeds
                    .lookupPriceFeeds()
                    .then(pfs => pfs
                        .filter(pf => pf.oracle && pf.oracle.class === "Witnet")
                        .map(pf => {
                            const caption = pf.symbol.split("#")[0]
                            const conditions = rulebook.getPriceFeedUpdateConditions(pf.symbol, network)
                            return {
                                ...pf,
                                updateConditions: {
                                    ...pf.updateConditions,
                                    deviationPercentage: conditions.deviationPercentage,
                                },
                                caption,
                                footprint
                            }
                        })
                    )
                    .catch(err => {
                        console.error(`❌ Fatal: cannot fetch price feeds from ${artifact}@${witPriceFeeds.address}:\n${err}`)
                        process.exit(0)
                    });
                
                maxCaptionWidth = Math.max(...pfs.map(({ caption })=> caption.length))
                priceFeeds = Object.fromEntries(await Promise.all(
                    pfs.map(async pf => {
                        const radHash = pf.oracle.sources
                        const bytecode = await witOracleRadonRegistry.lookupRadonRequestBytecode(radHash)
                        const request = Witnet.Radon.RadonRequest.fromBytecode(bytecode)
                        return [
                            pf.symbol.split("#")[0],
                            {
                                id4: pf.id4,
                                bytecode,
                                conditions: pf.updateConditions,
                                exponent: pf.exponent,
                                footprint: pf.footprint,
                                lastUpdate: pf.lastUpdate,
                                radHash,
                                request,
                            }
                        ]
                    })
                ));
                Object.entries(priceFeeds).forEach(([caption, { id4, conditions }]) => {
                    console.info(
                        `[${network}:${id4}:${caption}${" ".repeat(maxCaptionWidth - caption.length)}] Update conditions: { cooldown: ${
                            conditions.cooldownSecs
                        }", deviation: ${
                            conditions.deviationPercentage.toFixed(1)
                        }%, heartbeat: ${
                            conditions.heartbeatSecs
                        }", minWitnesses: ${
                            conditions.minWitnesses
                        } }`
                    );
                    dryRunPriceFeed(caption, footprint)
                })
            }
        } catch (err) {
            console.warn(`[${network}:${signer}] Cannot check footprint: ${err}`)
        }
    }

    async function dryRunPriceFeed(caption, _footprint) {
        if (priceFeeds[caption] && priceFeeds[caption].footprint === _footprint) {
            const { conditions, id4, exponent, radHash, request, lastUpdate } = priceFeeds[caption]
            const tag = `${network}:${id4}:${caption}${" ".repeat(maxCaptionWidth - caption.length)}`
            try {
                // determine whether polling for notarized update is required
                const heartbeatSecs = Math.floor(Date.now() / 1000) - Number(lastUpdate.timestamp)
                if (heartbeatSecs < conditions.heartbeatSecs) {
                    let dryrun = JSON.parse(await request.execDryRun())
                    if (!Object.keys(dryrun).includes("RadonInteger")) {
                        throw `Error: unexpected dry run result: ${JSON.stringify(dryrun)}`    
                    } else {
                        dryrun = parseInt(dryrun.RadonInteger)
                    }
                    const deviation = (
                        lastUpdate.price > 0
                            ? 100 * ((dryrun / 10 ** (-exponent)) - lastUpdate.price) / lastUpdate.price
                            : 0
                    );
                    if (Math.abs(deviation) < conditions.deviationPercentage) {
                        throw `${deviation >= 0 ? "+" : ""}${deviation.toFixed(2)} % deviation after ${heartbeatSecs} secs.`
                    } else {
                        console.info(`[${tag}] Searching latest update due to a price deviation of ${deviation.toFixed(2)} % ...`)
                    }
                
                } else {
                    console.info(`[${tag}] Searching latest update due to heartbeat after ${heartbeatSecs} secs ...`)
                }
                console.info(`[${tag}] [>] RAD hash: ${radHash.slice(2)}`)
                const since = - Math.ceil(conditions.heartbeatSecs / 20)
                await _witnet
                    .searchDataRequests(radHash.slice(2), { limit: 16, mode: "ethereal", since, reverse: true })
                    .then(async dataRequests => {
                        try {
                            dataRequests = dataRequests.filter(report => (
                                report.query?.witnesses >= conditions.minWitnesses
                                && report.result 
                                // && report.result.finalized
                                && report.result.cbor_bytes
                                && Number.isInteger(utils.cbor.decode(report.result.cbor_bytes))
                                && BigInt(report.result.timestamp) > lastUpdate.timestamp
                            ));
                            if (dataRequests.length > 0) {
                                const report = await _kermit.getDataPushReport(dataRequests[0].hash, network)
                                const { hash, result } = report
                                console.info(`[${tag}] [<] DRT hash: ${hash}`)
                                const price = parseInt(utils.cbor.decode(result.cbor_bytes))
                                const freshness = Math.floor(Date.now() / 1000) - Number(result.timestamp)
                                console.info(`[${tag}] [<] Queued report: { price: ${Number(price) / 10 ** (-exponent)}, timestamp: ${result.timestamp}, freshness: ${freshness}" }`)
                                // console.debug(`[${tag}] [<] Signed report: ${JSON.stringify(report, null, 4)}`)
                                const index = pendingUpdates.findIndex(task => task.id4 === id4)
                                if (index >= 0) {
                                    pendingUpdates[index] = { id4, caption, report }
                                } else {
                                    pendingUpdates.push({ id4, caption, report })
                                }
                            
                            } else {
                                throw `[<] No recent updates found just yet ...`
                            }
                        } catch (err) {
                            throw `[x] Cannot fetch signed report from ${_kermit.url}: ${err}`
                        }
                    })
                    .catch(err => console.warn(`[${tag}] ${err}`))

            } catch (err) {
                console.warn(`[${tag}] ${err}`)
            }
            setTimeout(() => dryRunPriceFeed(caption, _footprint), DRY_RUN_POLLING_SECS * 1000)

        } else {
            // live and let die
        }
    }

    async function purgePendingUpdates() {
        try {
            const tasks = [ ...pendingUpdates ]
            pendingUpdates = []
            for (let index = 0; index < tasks.length; index ++) {
                const { id4, caption, report } = tasks[index]
                const tag = `${network}:${id4}:${caption}${" ".repeat(maxCaptionWidth - caption.length)}`
                if (priceFeeds[caption]) {
                    const { conditions, lastUpdate } = priceFeeds[caption]
                    const elapsed = Math.floor(Date.now() / 1000) - Number(lastUpdate.timestamp)
                    if (elapsed > conditions.cooldownSecs) {
                        console.info(`[${tag}] Reporting update after ${elapsed} secs ...`)
                        const receipt = await witPriceFeeds.pushDataReport(report, { 
                            gasLimit,
                            maxGasPrice,
                            onTransaction: (hash) => {
                                console.info(`[${tag}] [>] EVM tx hash: ${hash} ...`)
                            },
                            onTransactionReceipt: (receipt) => {
                                console.info(`[${tag}] [>] EVM gas price: ${ethers.formatUnits(receipt.gasPrice, 9)} gwei`)
                                console.info(`[${tag}] [>] EVM gas used:  ${commas(receipt.gasUsed)}`)
                            }
                        })
                        .catch(err => { 
                            console.warn(`[${tag}] [<] ${err}`)
                        })
                        const lastUpdate = await witPriceFeeds.getPriceUnsafe(id4)    
                        if (
                            !receipt
                            && priceFeeds[caption].lastUpdate.timestamp > lastUpdate.timestamp
                            && pendingUpdates.findIndex(task => task.id4 === id4) < 0
                        ) {
                            console.debug(`[${tag}] ==> Postponing the update a few more secs ...`)
                            pendingUpdates.push(tasks[index])
                        }
                        priceFeeds[caption].lastUpdate = lastUpdate
                        console.info(`[${tag}] [<] Last update: ${JSON.stringify(lastUpdate)}`)
                    } else {
                        console.info(`[${tag}] Awaiting update at least ${conditions.cooldownSecs - elapsed} more secs ...`)
                    }
                }
            }
        } catch (err) {
            console.warn(`[${witPriceFeeds.address}] Error while purging updates: ${err}`)
        }
    }
}
