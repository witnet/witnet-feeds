const { Witnet } = require("@witnet/sdk")
const { WitOracle } = require("@witnet/ethers")

require("dotenv").config()
const moment = require("moment")

const { assets, utils } = require("../../dist/src/lib")
const helpers = require("../bin/helpers")
const { colors } = helpers

const host = helpers.spliceFromArgs(process.argv, `--host`) || "http://127.0.0.1"
const port = helpers.parseIntFromArgs(process.argv, `--port`) || 8545
const witRpcUrl = helpers.spliceFromArgs(process.argv, `--witnet`) 

let network = helpers.spliceFromArgs(process.argv, `--network`) 
let target = helpers.spliceFromArgs(process.argv, `--target`)

main()

async function main () {

    const witnet = await Witnet.JsonRpcProvider.fromEnv(witRpcUrl === "testnet" 
        ? "https://rpc-testnet.witnet.io"
        : (witRpcUrl === "mainnet" ? "https://rpc-01.witnet.io" : witRpcUrl)
    );
    
    const priceFeeds = utils.getNetworkPriceFeeds(network)

    if (network) {
        let witOracle
        try {
            witOracle = await WitOracle.fromJsonRpcUrl(`${host}:${port}`)
            if (network.toLowerCase() !== witOracle.network) {
                console.error(`Error: gateway at ${host}:${port} connects to a different network (${witOracle.network})`)
                process.exit(1)
            } 
            if (utils.isEvmNetworkMainnet(network) !== (witnet.network === "mainnet")) {
                console.error(`Error: cannot connect to the Witnet ${witnet.network} and an EVM ${witnet.network ==="mainnet" ? "testnet" : "mainnet"} at the same time.`)
                process.exit(1)
            }

        } catch (err) {
            console.error(`Error: cannot connect to ${network} network:\n${err}`)
            process.exit(1)
        }
        
        helpers.traceHeader(`${network.toUpperCase()}`, helpers.colors.lcyan)

        const { provider } = witOracle
        const framework = await helpers.prompter(utils.fetchWitOracleFramework(provider))
    
        if (!target) {
            if (!framework.WitPriceFeedsV3) {
                console.info(`Network ${network} supports no price feeds.`)
                process.exit(0)
            
            } else {
                target = framework.WitPriceFeedsV3.address
            }
        }

        const wrapper = await witOracle.getWitPriceFeedsAt(target)
        const artifact = await wrapper.getEvmImplClass() 
        if (artifact !== "WitPriceFeedsV3") {
            console.error(`Error: unsupported ${artifact} at ${target}`)
            process.exit(1)
        }
        const version = await wrapper.getEvmImplVersion()
        const maxWidth = Math.max(18, artifact.length + 2)
        console.info(
            `> ${
            helpers.colors.lwhite(artifact)
            }:${
            " ".repeat(maxWidth - artifact.length)
            }${
            helpers.colors.mblue(target)
            } ${
            helpers.colors.blue(`[ ${version} ]`)
            }`
        )

        const lookupPriceFeeds = await wrapper.lookupPriceFeeds()
        console.log("lookupPriceFeeds =>", lookupPriceFeeds)

        const radHashes = require("../../witnet/requests.json")

        let priceTargets = []
        priceTargets = [...Object.entries(priceFeeds.mappers).map(([caption, mapper]) => ([
            caption, {
                type: "mapper",
                verb: mapper.mapper,
                target: mapper.deps
            }
        ]))]
        priceTargets.push(...Object.entries(priceFeeds.oracles).map(([caption, oracle]) => ([
            caption, {
                type: "oracle",
                verb: oracle.oracle,
                target: oracle.address,
            }
        ])))
        priceTargets.push(...priceFeeds.requests.map(caption => {
            const target = utils.captionToWitOracleRequestPrice(caption)
            const verb = utils.requireRadonRequest(target, assets)
            return [
                caption, {
                    type: "request",
                    verb,
                    target,
                }
            ]
        }))
        priceTargets = await Promise.all(
            priceTargets.map(async ([caption, specs]) => {
                const [ id4, settled ] = await Promise.all([
                    await wrapper.getId4(caption),
                    await wrapper.isCaptionSupported(caption),
                ])
                let verified
                if (specs.type === "request") {
                    verified = (
                        radHashes[network]
                        && radHashes[network][specs.target] 
                        && radHashes[network][specs.target] !== ""
                        && radHashes[network][specs.target] === specs.verb.radHash
                    );
                }
                const conditions = utils.getPriceFeedUpdateConditions(caption, network)
                return [
                    caption,
                    { ...specs, id4, settled, verified, conditions }
                ]
            })
        );
        priceTargets = priceTargets.sort((a, b) => a[0].localeCompare(b[0]))

        helpers.traceTable(
            priceTargets.map(([caption, obj]) => {
                return [
                    obj.id4,
                    caption,
                    obj.type,
                    obj.type === "request" ? "" : obj.verb,
                    obj.conditions.deviationPercentage,
                    obj.conditions.heartbeatSecs,
                    "",
                    "",
                    ""
                ]
            }), {
                headlines: [
                    ":ID4",
                    ":CAPTION",
                    ":type",
                    ":verb",
                    ":max.dev",
                    ":heartbeat",
                    "providers:",
                    ":LAST UPDATE",
                    "DEVIATION:",
                ],
                colors: [
                    colors.lwhite,
                    colors.mgreen,
                    colors.green,
                    colors.green,
                    colors.gray,
                    colors.gray,
                ]
            }
        )

        // console.log(JSON.stringify(priceFeeds, null, 4))
    
    } else {
        helpers.traceHeader(`WITNET ${witnet.network.toUpperCase()}`, helpers.colors.lwhite)

        const captions = []
        const radHashes = Object.entries(require("../../witnet/requests.json"))

        let { requests } = priceFeeds

        // read all radon requests required to be polled
        requests = requests
            .map(caption => {
                caption = caption.split("#")[0]
                captions.push(caption)
                const artifact = utils.captionToWitOracleRequestPrice(caption)
                let request
                try {
                    request = utils.requireRadonRequest(artifact, assets)
                } catch (err) {
                    console.error(`Error: ${colors.mred(artifact)}: ${err}`)
                }
                const networks = utils.getPriceFeedNetworks(caption, witnet.network === "mainnet")
                return [
                    caption,
                    artifact,
                    request,
                    networks
                ]
            })
            .filter(([,,request]) => request !== undefined);
        
        // remove repeated records or those that are not required in any network
        requests = requests
            .filter(([caption], index) => captions.indexOf(caption) === index)
            .sort(([a], [b]) => a.localeCompare(b))
            // .filter(([,,, networks]) => networks.length > 0)

        // search latest data requests solving every Witnet-based price feed
        console.info(`> Dry-running ${requests.length} data requests ...`)
        const maintenance = { networks: [], requests: [] }
        requests = await Promise.all(
            requests.map(async ([caption, artifact, request, networks]) => {
                let [ dataRequests, dryRunResult ] = await Promise.all([
                    witnet.searchDataRequests(request.radHash, { limit: 16, reverse: true }),
                    request.execDryRun(true)
                ])

                const drt = dataRequests.find(drt => 
                    drt?.result
                    && drt.result.finalized 
                    && drt.result.cbor_bytes
                ); // todo: check cbor_bytes is not tagged with error
                
                let dryRun
                let failingSources = 0
                try {
                    const parsed = JSON.parse(dryRunResult)
                    dryRun = parseInt(parsed?.tally?.result["RadonInteger"])
                    parsed?.retrieve?.forEach((retrieval, index) => {
                        if (!retrieval?.result || retrieval.result["RadonError"]) {
                            const authority = request.sources[index].authority.split(".").slice(-2).join(".")
                            console.info(`> ${colors.yellow(artifact)}: cannot retrieve data from ${colors.magenta(utils.camelize(authority))}`)
                            failingSources += 1
                        }
                    });
                } catch {}

                if (failingSources >= request.sources.length / 2) {
                    console.info(`> ${colors.mred(artifact)}: too many failing sources: ${failingSources} out of ${request.sources.length}`)
                    maintenance.requests.push(artifact)
                }

                const updateConditions = utils.getPriceFeedUpdateConditions(caption, witnet.network === "mainnet")
                
                const uptodate = radHashes
                    .filter(([network, deployed]) => {
                        if (deployed[artifact] === request.radHash) return true;
                        else if (deployed[artifact] && deployed[artifact] !== request.radHash) {
                            console.info(`> ${colors.yellow(artifact)}: request is outdated in ${colors.cyan(network)}`);
                            maintenance.networks.push(network)
                        }
                        return false;
                    })
                    .map(([network, ]) => network)
                    .length;

                networks.forEach(network => {
                    if (!radHashes[network] || !radHashes[network][caption]) {
                        console.info(`> ${colors.yellow(artifact)}: needs to be deployed in ${colors.cyan(network)}`);
                        maintenance.networks.push(network)
                    }
                })
                
                return [
                    caption,
                    artifact,
                    request,
                    drt ? {
                        hash: drt?.hash,
                        lastPrice: utils.cbor.decode(utils.fromHexString(drt.result.cbor_bytes)),
                        timestamp: drt.result.timestamp,
                    } : undefined,
                    drt?.hash ? dryRun : undefined,
                    { ...updateConditions },
                    { total: networks.length, upToDate: uptodate },
                    { total: request.sources.length, failing: failingSources },
                ]
            })
        );
        console.info()

        if (requests.length > 0) {
            let deployed = 0
            helpers.traceTable(
                requests.map(([caption,, request, drt, dryRun, conditions, networks, providers]) => {
                    const { radHash } = request
                    const deviation = drt?.lastPrice && dryRun ? Number(100 * (dryRun - drt.lastPrice) / drt.lastPrice).toFixed(3) : undefined
                    const sign = deviation >= 0 ? "+" : "-"
                    deployed += networks.total
                    const now = Math.floor(Date.now() / 1000)
                    return [
                        caption,
                        `${radHash.slice(0, 6)}..${radHash.slice(-5)}`,
                        `± ${conditions?.deviationPercentage.toFixed(1)} %`,
                        moment.duration(conditions?.heartbeatSecs, "seconds").humanize(),
                        moment.duration(conditions?.cooldownSecs, "seconds").humanize(),
                        networks.total != networks.upToDate
                            ? `${colors.cyan(`${networks.upToDate} out of `)}${colors.mcyan(networks.total)}`
                            : `${colors.mcyan(networks.total)}`,
                        providers.failing > 0
                            ? `${colors.mmagenta(`${providers.total - providers.failing}`)} ${colors.magenta(`out of ${providers.total}`)}`
                            : colors.mmagenta(providers.total),
                        drt?.timestamp ? (moment.duration(now - drt?.timestamp, "seconds").asSeconds() > conditions?.heartbeatSecs
                            ? colors.mred(moment.unix(drt.timestamp).fromNow())
                            : colors.yellow(moment.unix(drt.timestamp).fromNow())
                        ) : "",
                        deviation <= conditions?.deviationPercentage ? colors.green(`${sign} ${Math.abs(deviation).toFixed(3)} %`) : (
                            isNaN(deviation) ? "" : colors.red(`${sign} ${Math.abs(deviation).toFixed(3)} %`)
                        ),
                    ]
                }), {
                    headlines: [
                        ":CAPTION",
                        "RADON REQUEST",
                        "threshold:",
                        ":heartbeat",
                        ":cooldown",
                        "networks",
                        "providers",
                        "LAST REQUEST:",
                        "DEVIATION:",
                    ],
                    colors: [
                        colors.lwhite,
                        colors.mgreen,
                        colors.gray,
                        colors.gray,
                        colors.gray,
                    ]
                }
            );
            console.info(
                `^ Listed ${requests.length} distinct price feeds deployed ${deployed} times through out ${
                    utils.getEvmNetworks()
                        .filter(network => !(witnet.network === "mainnet" !== utils.isEvmNetworkMainnet(network))).length
                    } different EVM ${
                        witnet.network === "mainnet" ? "mainnets" : "testnets"
                    }.`
            );
        }
        if (maintenance.networks.length > 0) {
            console.info(`\n> The following ${witnet.network === "mainnet" ? "mainnets" : "testnets"} require maintenance:`)
            new Set(maintenance.networks.sort()).forEach(network => console.info(`  ${colors.cyan(network)}`))
        }
        if (maintenance.requests.length > 0) {
            console.info(`\n> The following requests require maintenance:`)
            new Set(maintenance.requests.sort()).forEach(network => console.info(`  ${colors.green(network)}`))
        }
    }
}
