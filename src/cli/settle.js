const { Witnet } = require("@witnet/sdk")
const { ethers, WitOracle, PriceFeedOracles, PriceFeedMappers } = require("@witnet/ethers")

const { execSync } = require("node:child_process")
require("dotenv").config()
const moment = require("moment")

const { assets, utils } = require("../../dist/src/lib")
const radHashes = require("../../witnet/requests.json")
const helpers = require("../bin/helpers")
const { colors } = helpers

const host = helpers.spliceFromArgs(process.argv, `--host`) || "http://127.0.0.1"
const port = helpers.parseIntFromArgs(process.argv, `--port`) || 8545
const signer = helpers.spliceFromArgs(process.argv, `--signer`)
const witRpcUrl = helpers.spliceFromArgs(process.argv, `--witnet`) 

let network = helpers.spliceFromArgs(process.argv, `--network`) 
let target = helpers.spliceFromArgs(process.argv, `--target`)

main()

async function main () {

    const witnet = await Witnet.JsonRpcProvider.fromEnv(
        witRpcUrl === "testnet" ? "https://rpc-testnet.witnet.io" : (
            witRpcUrl === "mainnet" ? "https://rpc-01.witnet.io" : witRpcUrl
        ),
    );

    const witOracle = await WitOracle.fromJsonRpcUrl(`${host}:${port}`, signer)
    if (network && witOracle.network !== network.toLowerCase()) {
        console.error(`Error: gateway at ${host}:${port} connects to a different network (${witOracle.network})`)
        process.exit(1)
    }
    
    network = witOracle.network
    if (utils.isEvmNetworkMainnet(network) !== (witnet.network === "mainnet")) {
        console.error(`Error: cannot connect to the Witnet ${witnet.network} and an EVM ${witnet.network ==="mainnet" ? "testnet" : "mainnet"} at the same time.`)
        process.exit(1)
    }
    
    helpers.traceHeader(`${network.toUpperCase()}`, helpers.colors.lcyan)

    const { provider } = witOracle
    const framework = await helpers.prompter(utils.fetchWitOracleFramework(provider))
    if (!target) {
        if (!framework.WitPriceFeedsV3) {
            console.info(`Network ${network} supports no V3 price feeds.`)
            process.exit(0)        
        } else {
            target = framework.WitPriceFeedsV3.address
        }
    }

    const wrapper = await witOracle.getWitPriceFeedsAt(target)
    const [ curator, artifact, version, consumer , master] = await Promise.all([
        await wrapper.getEvmCurator(),
        await wrapper.getEvmImplClass(),
        await wrapper.getEvmImplVersion(),
        await wrapper.getEvmConsumer(),
        await wrapper.getEvmMaster(),
    ])
    if (artifact !== "WitPriceFeedsV3") {
        console.error(`Error: unsupported ${artifact} at ${target}`)
        process.exit(1)
    }
    let maxCaptionWidth = Math.max(18, artifact.length + 2)
    console.info(
        `> ${
        helpers.colors.lwhite(artifact)
        }:${
        " ".repeat(maxCaptionWidth - artifact.length)
        }${
        helpers.colors.mblue(target)
        } ${
        helpers.colors.blue(`[ ${version} ]`)
        }`
    )
    if (master !== "0x0000000000000000000000000000000000000000") {
        console.info(`> Master address:    ${colors.blue(consumer)}`)
    }
    console.info(`> Curator address:   ${colors.magenta(curator)}`)
    if (consumer !== "0x0000000000000000000000000000000000000000") {
        console.info(`> Consumer address:  ${colors.cyan(consumer)}`)
    }
    console.info()

    // Parse `priceFeeds.json` resource price:
    const networkPriceFeeds = utils.getNetworkPriceFeeds(network)

    // Fetch price feeds currently settled on-chain:
    let onchainPriceFeeds = await wrapper.lookupPriceFeeds()

    const tasks = { removals: [], mappers: [], conditions: [] }

    // ================================================================================================================
    // --- Checkout Witnet requests -----------------------------------------------------------------------------------

    // panic if any Witnet-solved price feed is declared more than once
    Object.keys(networkPriceFeeds.oracles).forEach(caption => {
        if (Object.keys(networkPriceFeeds.oracles).filter(key => key === caption).length > 1) {
            console.error(`> ${colors.mred(caption)} is declared multiple times as a Witnet-solved price feed.`)
            console.error(`> Please, revisit ${helpers.colors.gray("./witnet.priceFeeds.json")}.`)
            process.exit(1)
        }
    })

    // load specs of Witnet-solved price feeds    
    const requests = networkPriceFeeds.requests.map(caption => {
        const target = utils.captionToWitOracleRequestPrice(caption)
        const sources = utils.requireRadonRequest(target, assets)
        return [
            caption, {
                class: "oracle:witnet",
                sources,
                target,
                conditions: utils.getPriceFeedUpdateConditions(caption, network),
            }
        ]
    })
    
    // settle on-chain price feeds based on Witnet Radon requests
    tasks.requests = requests
        .filter(([caption, obj]) => {
            const found = onchainPriceFeeds.find(pf => pf.symbol === caption)
            // console.log(found)
            if (found && (
                !found.oracle
                    || found.oracle.class.toLowerCase() !== "witnet"
                    || found.oracle.sources !== `0x${obj.sources.radHash}`
            )) {
                tasks.removals.push(caption)
                console.info(`> ${colors.yellow(caption)} has new parameters.`)
                return true
            } else if (!found) {
                console.info(`> ${colors.green(caption)} needs to be settled.`)
            }
            return !found
        })        
        .map(([caption, obj]) => ({ 
            caption, 
            decimals: parseInt(caption.split("#")[0].split("-").pop()) || 0, 
            radHash: `0x${obj.sources.radHash}`
        }));

    tasks.verifications = requests
        .filter(([caption, obj]) => {
            if (obj.sources.radHash !== radHashes[network][obj.target]) {
                console.info(`> ${colors.yellow(caption)} requires data sources to be verified.`)
                return true
            } else {
                return false
            }
        })
        .map(([,obj]) => obj.target)


    // ================================================================================================================
    // --- Checkout third-party price feeds ---------------------------------------------------------------------------

    // panic if repeated captions are found
    Object.entries(networkPriceFeeds.oracles).forEach(([caption, specs]) => {
        if (requests.indexOf(caption) >= 0) {
            console.error(`> ${colors.mred(caption)} is declared as being both a Witnet and a ${helpers.camelize(specs.class)} price feed.`)
            console.error(`> Please, revisit ${helpers.colors.gray("./witnet.priceFeeds.json")}.`)
            process.exit(1)
        } else if (Object.keys(networkPriceFeeds.oracles).filter(key => key === caption).length > 1) {
            console.error(`> ${colors.mred(caption)} is declared multiple times as an oraclized price feed.`)
            console.error(`> Please, revisit ${helpers.colors.gray("./witnet.priceFeeds.json")}.`)
            process.exit(1)
        }
    })
     
    // load specs of oraclized price feeds
    const oracles = Object.entries(networkPriceFeeds.oracles).map(([caption, oracle]) => ([
        caption, {
            class: `oracle:${oracle.class}`,
            sources: oracle.sources,
            target: oracle.target,
            conditions: utils.getPriceFeedUpdateConditions(caption, network),
        }
    ]))

    // settle oraclized price feeds that have not yet been settled or otherwise settled with different parameters
    tasks.oracles = oracles
        .filter(([caption, obj]) => {
            const found = onchainPriceFeeds.find(pf => pf.symbol === caption)
            const supported = Object.values(PriceFeedOracles).includes(helpers.camelize(obj.class.split(":").pop().toLowerCase()))
            if (!supported) {
                console.info(`> ${colors.red(caption)} requires some unsupported "${obj.class}".`)
                process.exit(1)
            
            } else if (found && (
                !found.oracle
                    || found.oracle.class.toLowerCase() !== obj.class.split(":").pop().toLowerCase()
                    || found.oracle.target !== obj.target
                    || found.oracle.sources !== (obj.sources || "0x0000000000000000000000000000000000000000000000000000000000000000")
            )) {
                tasks.removals.push(caption)
                console.info(`> ${colors.yellow(caption)} has new parameters.`)
                // console.log(found.oracle.sources, obj.sources)
                // console.log(found.oracle.target, obj.target)
                return true
            
            } else if (!found) {
                console.info(`> ${colors.green(caption)} needs to be settled.`)
            }
            return !found
        })
        .map(([caption, obj]) => {
            return { 
                caption, 
                decimals: parseInt(caption.split("#")[0].split("-").pop()) || 0, 
                oracle: helpers.camelize(obj.class.split(":").pop().toLowerCase()),
                target: obj.target,
                sources: obj.sources,
            }
        });


    // ================================================================================================================
    // --- Checkout price feeds mappings ------------------------------------------------------------------------------

    // panic if repeated captions are found
    Object.entries(networkPriceFeeds.mappers).forEach(([caption, specs]) => {
        if (requests.indexOf(caption) >= 0) {
            console.error(`> ${colors.mred(caption)} is declared as being both a Witnet and a mapped:${helpers.camelize(specs.class)} price feed.`)
            console.error(`> Please, revisit ${helpers.colors.gray("./witnet.priceFeeds.json")}.`)
            process.exit(1)
        } else if (oracles.indexOf(caption) >= 0) {
            console.error(`> ${colors.mred(caption)} is declared as being both an oraclized and a mapped:${helpers.camelize(specs.class)} price feed.`)
            console.error(`> Please, revisit ${helpers.colors.gray("./witnet.priceFeeds.json")}.`)
            process.exit(1)
        } else if (Object.keys(networkPriceFeeds.mappers).filter(key => key === caption).length > 1) {
            console.error(`> ${colors.mred(caption)} is declared multiple times as a mapped price feed.`)
            console.error(`> Please, revisit ${helpers.colors.gray("./witnet.priceFeeds.json")}.`)
            process.exit(1)
        }
    })

    // load specs of mapped price feeds
    let mappers = Object.entries(networkPriceFeeds.mappers).map(([caption, mapper]) => ([
        caption, {
            class: `mapper:${mapper.class}`,
            sources: mapper.deps,
            conditions: utils.getPriceFeedUpdateConditions(caption, network),
        }
    ]))

    // respect the order of precedence ...
    mappers = mappers.sort(([caption], [,{sources}]) => {
        const a_index = mappers.indexOf(caption)
        sources.forEach(source => {
            if (mappers.indexOf(source) < a_index) {
                return 1
            }
        })
        return -1
    })

    // settle mapped price feeds that have not yet been settled or otherwise settled with different parameters
    for (let runs = 0; runs < 16; runs ++) {
        tasks.mappers = mappers
        .filter(([caption, obj]) => {
            const found = onchainPriceFeeds.find(pf => pf.symbol === caption)
            const supported = Object.values(PriceFeedMappers).includes(helpers.camelize(obj.class.split(":").pop().toLowerCase()))
            if (!supported) {
                console.info(`> ${colors.red(caption)} requires unsupported "${obj.class}".`)
                process.exit(1)
            }
            if (found && (
                !found.mapper
                    || found.mapper.class.toLowerCase() !== obj.class.split(":").pop().toLowerCase()
                    || found.mapper.deps.some(caption => !obj.sources.includes(caption))
                    || obj.sources.some(caption => !found.mapper.deps.includes(caption))
            )) {
                if (!tasks.removals.includes(caption)) tasks.removals.push(caption);
                if (!tasks.mappers.find(mapper => mapper.caption === caption)) {
                    console.info(`> ${colors.yellow(caption)} has new dependencies.`)   
                }
                return true
            }
            if (!found) {
                if (!tasks.mappers.find(mapper => mapper.caption === caption)) {
                    console.info(`> ${colors.green(caption)} needs to be settled.`)
                }
                return true
            
            } else if (obj.sources.some(dependency => tasks.removals.includes(dependency))) {
                if (!tasks.mappers.find(mapper => mapper.caption === caption)) {
                    console.info(`> ${colors.green(caption)} has a changing dependency.`)
                }
                return true
            
            } else {
                return false
            }
            
        })        
        .map(([caption, obj]) => {
            return { 
                caption, 
                decimals: parseInt(caption.split("#")[0].split("-").pop()) || 0, 
                mapper: helpers.camelize(obj.class.split(":").pop().toLowerCase()),
                deps: obj.sources,
            }
        });
    }


    // ================================================================================================================
    // --- Checkout update conditions to be altered -------------------------------------------------------------------

    function _checkIfDiffers(onchain, specs) {
        return (
            Number(onchain.callbackGas) !== specs?.callbackGas
                || onchain.computeEMA !== specs?.computeEMA
                || Number(onchain.cooldownSecs) !== specs?.cooldownSecs
                || Number(onchain.heartbeatSecs) !== specs?.heartbeatSecs
                || Number(onchain.maxDeviationPercentage) !== specs?.maxDeviationPercentage
                || Number(onchain.minWitnesses) !== specs?.minWitnesses
        )
    }

    tasks.conditions.push(...[...requests, ...oracles, ...mappers]
        .filter(([caption, obj]) => {
            const found = onchainPriceFeeds.find(({ symbol }) => symbol === caption)
            const differs = found?.updateConditions && obj.conditions && _checkIfDiffers(found.updateConditions, obj.conditions)
            if (!found || differs) {
                console.info(`> ${colors.yellow(caption)} requires conditions to be altered. `)
                return true
            } else {
                return false
            }
        })
        .map(([caption, obj]) => ({
            caption,
            conditions: obj.conditions
        }))
    );

    
    // ================================================================================================================
    // --- Checkout price feeds to be decommissioned ------------------------------------------------------------------

    onchainPriceFeeds.forEach(pf => {
        if (
            !requests.find(([caption]) => caption === pf.symbol)
                && !oracles.find(([caption]) => caption === pf.symbol)
                && !mappers.find(([caption]) => caption === pf.symbol)
        ) {
            tasks.removals.push(pf.symbol)
            console.info(`> ${colors.red(pf.symbol)} is required no more.`)
        }
    })


    // ================================================================================================================
    // --- PERFORM TO-DO TASKS ----------------------------------------------------------------------------------------
    
    if (tasks.verifications.length > 0) {
        console.info(colors.lyellow(`\n\n  >>> VERIFY RADON REQUESTS <<<`,));
        execSync(
            `npx witnet-ethers assets ${tasks.verifications.join(" ")} --deploy --force`,
            { stdio: "inherit", stdout: "inherit" }
        );
    }

    async function _invokeAdminTask(func, ...params) {
        if (typeof params[0] === "string") console.info(`\n  ${colors.lwhite(params[0])}:`);
        const receipt = await func(...params, {
            evmConfirmations: helpers.parseIntFromArgs(process.argv, `--port`) || 2,
            onSettlePriceFeedTransaction: (txHash) => {
                console.info(`  - EVM signer:${" ".repeat(maxCaptionWidth - 10)}${helpers.colors.gray(wrapper.signer.address)}`)
                process.stdout.write(`  - EVM transaction:${" ".repeat(maxCaptionWidth - 15)}${helpers.colors.gray(txHash)} ... `)
            },
            onSettlePriceFeedTransactionReceipt: () => {
                process.stdout.write(`${helpers.colors.lwhite("OK")}\n`)
            },
        }).catch(err => {
            process.stdout.write(`${helpers.colors.mred("FAIL:\n")}`)
            console.error(err)
            process.exit(1)
        })
        if (receipt) {
            console.info(`  - EVM block number:${" ".repeat(maxCaptionWidth - 16)}${helpers.colors.lwhite(helpers.commas(receipt?.blockNumber))}`)
            console.info(`  - EVM tx gas price:${" ".repeat(maxCaptionWidth - 16)}${helpers.colors.lwhite(helpers.commas(receipt?.gasPrice))} weis`)
            console.info(`  - EVM tx fee:${" ".repeat(maxCaptionWidth - 10)}${helpers.colors.lwhite(ethers.formatEther(receipt.fee))} ETH`)
            const value = (await receipt.getTransaction()).value
            console.info(`  - EVM randomize fee:${" ".repeat(maxCaptionWidth - 17)}${helpers.colors.lwhite(ethers.formatEther(value))} ETH`)
            console.info(`  - EVM effective gas:${" ".repeat(maxCaptionWidth - 17)}${helpers.commas(Math.floor(Number((receipt.fee + value) / receipt.gasPrice)))} gas units`)
        }
    }

    if (wrapper.signer.address === curator) {
        
        if (tasks.removals.length > 0) {
            console.info(colors.lyellow(`\n  >>> REMOVE AFFECTED PRICE FEEDS <<<`))
            for (const caption of tasks.removals) {
                await _invokeAdminTask(
                    wrapper.removePriceFeed.bind(wrapper), 
                    caption, 
                )
            }
            console.info()
        }
        if (tasks.requests.length > 0) {
            console.info(colors.lyellow(`\n  >>> SETTLE WITNET PRICE FEEDS <<<`))
            for (const task of tasks.requests) {
                await _invokeAdminTask(
                    wrapper.settlePriceFeedRadonHash.bind(wrapper), 
                    task.caption, 
                    task.decimals, 
                    task.radHash
                )
            }
            console.info()
        }
        if (tasks.oracles.length > 0) {
            console.info(colors.lyellow(`\n  >>> SETTLE ORACLIZED PRICE FEEDS <<<`))
            for (const task of tasks.oracles) {
                await _invokeAdminTask(
                    wrapper.settlePriceFeedOracle.bind(wrapper), 
                    task.caption, 
                    task.decimals, 
                    task.oracle, 
                    task.target, 
                    task.sources
                )
            }
            console.info()
        }
        if (tasks.mappers.length > 0) {
            console.info(colors.lyellow(`\n  >>> SETTLE MAPPED PRICE FEEDS <<<`))
            for (const task of tasks.mappers) {
                await _invokeAdminTask(
                    wrapper.settlePriceFeedMapper.bind(wrapper), 
                    task.caption, 
                    task.decimals, 
                    task.mapper,
                    task.deps,
                )
            }
            console.info()
        }
        if (tasks.conditions.length > 0) {
            console.info(colors.lyellow(`\n  >>> SETTLE UPDATE CONDITIONS <<<`))
            const defaultConditions = utils.getDefaultUpdateConditions(witnet.network === "mainnet")
            const onchainDefaultConditions = await wrapper.getDefaultUpdateConditions()
            console.log(onchainDefaultConditions, defaultConditions)
            if (_checkIfDiffers(onchainDefaultConditions, defaultConditions)) {
                console.info(`\n  ${colors.lwhite("Default conditions")}:  ${JSON.stringify(defaultConditions)}`)
                await _invokeAdminTask(
                    wrapper.settleDefaultUpdateConditions.bind(wrapper), 
                    defaultConditions,
                )
            }
            for (const task of tasks.conditions) {
                console.log(task.caption, "=>", task, task.conditions)
                await _invokeAdminTask(
                    wrapper.settlePriceFeedUpdateConditions.bind(wrapper), 
                    task.caption, 
                    task.conditions,
                )
            }
            console.info()
        }
    
    } else {
        if (tasks.removals.length > 0 || tasks.requests.length > 0 || tasks.oracles.length > 0 || tasks.mappers.length > 0) {
            console.error(colors.red(`\n^ Pending tasks require curatorship and cannot be attended.`))
            process.exit(1)
        }
    }
        

    // ================================================================================================================
    // --- Merge settled price feeds ----------------------------------------------------------------------------------

    // ---> Reload price feeds settled on-chain:
    onchainPriceFeeds = await wrapper.lookupPriceFeeds()

    const priceFeeds = [...requests, ...oracles, ...mappers]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([caption, obj]) => {
            const found = onchainPriceFeeds.find(pf => pf.symbol === caption)
            const id4 = found?.id4
            let target = found?.oracle?.target
            let sources
            if (obj.class.endsWith(":witnet")) {
                sources = obj.sources.sources
                    .map(source => colors.mmagenta(source.authority.split(".").slice(-2)[0].toLowerCase()))
                    .sort((a, b) => a.localeCompare(b))
                    .join(" ");
            
            } else if (obj.class.startsWith("mapper")) {
                sources = obj.sources
                    .map(caption => colors.gray(caption.split(".").pop().toLowerCase())) //caption.split("-").slice(-2)[0].split(".").pop().toLowerCase())
                    .join(" ");
            
            } else {
                sources = colors.cyan(
                    found?.oracle?.sources !== "0x0000000000000000000000000000000000000000000000000000000000000000"
                        ? `${found.oracle.target}:${found.oracle.sources.slice(2, 10)}`
                        : found.oracle.target
                )
            }
            return [
                caption,
                { ...obj, id4, target, sources }
            ]
        })
        .filter(([,obj]) => obj.id4)

    helpers.traceTable(
        priceFeeds.map(([caption, obj]) => {
            return [
                obj.id4,
                caption,
                obj.class,
                obj.sources,
                `± ${obj.conditions.maxDeviationPercentage.toFixed(1)} %`,
                moment.duration(obj.conditions.heartbeatSecs, "seconds").humanize(),
                moment.duration(obj.conditions.cooldownSecs, "seconds").humanize(),
                obj.class === "oracle:witnet" ? `± ${obj.conditions.deviationPercentage.toFixed(1)} %` : "",
                
            ]
        }), {
            headlines: [
                ":ID4",
                ":CAPTION",
                ":solver",
                ":sources",
                "max.dev.:",
                ":liveness",
                ":cooldown",
                "thrshold:",
            ],
            colors: [
                colors.lwhite,
                colors.mgreen,
                colors.green,,
                colors.gray,
                colors.gray,
                colors.gray,
                colors.magenta,
            ]
        }
    )
}
    