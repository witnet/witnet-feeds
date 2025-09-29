const framework = require("witnet-solidity-bridge").default
const merge = require("lodash.merge")

const updateConditions = require("../../witnet/updateConditions.json")
const priceFeeds = require("../../witnet/priceFeeds.json")

export * from "@witnet/ethers/utils"
import * as _utils from "@witnet/ethers/utils"

const _networks = _utils.getEvmNetworks()
const _networksPriceFeeds = Object.fromEntries(_utils.getEvmNetworks().map(network => {
    const pfs = _getNetworkPriceFeeds(network)

    pfs.mappers = Object.fromEntries(
        Object.entries(pfs.mappers)
            .filter(([key, mapper]) => {
                const deps = ((mapper as any).deps as string[]) || []
                return deps.every(caption => 
                    (pfs.requests.includes(caption) && !pfs.requests.includes(key))
                    || (Object.keys(pfs.oracles).includes(caption) && !Object.keys(pfs.oracles).includes(key)) 
                    || Object.keys(pfs.mappers).includes(caption) 
                )
            })
        );
    for (let runs = 0; runs < 2; runs ++) {
        pfs.mappers = Object.fromEntries(
            Object.entries(pfs.mappers)
                .filter(([, mapper]) => {
                    const deps = ((mapper as any).deps as string[]) || []
                    return deps.every(caption => 
                        pfs.requests.includes(caption)
                        || Object.keys(pfs.mappers).includes(caption)
                        || Object.keys(pfs.oracles).includes(caption)
                    )
                })
            );  
    }
    return [
        network,
        pfs
    ]
}));

const camelize = (str: string) => capitalizeFirstLetter(str.toLowerCase())
const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

export function captionToWitOracleRequestPrice(caption: string) {
    let prefix = ""
    const symbol = caption.split("#")[0] || ""
    const dashes = symbol.split("-")
    const decimals = dashes.pop() || ""
    const slashes = dashes.pop()?.split("/") || dashes
    const quote = slashes?.pop() || ""
    let base = slashes?.pop() || ""
    if (base.toLowerCase().indexOf("price-") >= 0) {
        base = base.split("-").pop() || ""
    } else if (base.indexOf(".") >= 0) {
        const dots = base.split(".")
        base = dots.pop() || ""
        prefix = dots.pop() || ""
    }
    return `WitOracleRequestPrice${camelize(prefix)}${camelize(base)}${camelize(quote)}${camelize(decimals)}`
}

function _getNetworkPriceFeeds(network: string): any {
    let res = { ...priceFeeds.default }
    if (!res.requests) res.requests = []
    framework.utils.getNetworkTagsFromString(network).forEach((network: string) => {
        const tmp = priceFeeds[network]
        res.mappers = merge(res?.mappers, tmp?.mappers)
        res.oracles = merge(res?.oracles, tmp?.oracles)
        res.requests = [...new Set([ ...res?.requests || [], ...tmp?.requests || []])]
    })
    return { ...res }
}

export function getNetworkPriceFeeds(network?: string): any {
    if (network) {
        return _networksPriceFeeds[network]
    } else {
        let res: any = {}
        res.mappers = {}
        res.oracles = {}
        res.requests = [];
        (Object.values(priceFeeds) as Array<{ mappers: any, oracles: any, requests: string[]}>)
            .forEach((section: any) => {
                res.mappers = merge(res?.mappers, section?.mappers)
                res.oracles = merge(res?.oracles, section?.oracles)
                res.requests.push(...section?.requests || []) 
            });
        return res
    }
}

export function getPriceFeedNetworks(caption: string, mainnets: boolean): string[] {
    return _networks
        .filter((network: string) => {
            const { requests, mappers, oracles } = _networksPriceFeeds[network]
            return (
                !(mainnets !== _utils.isEvmNetworkMainnet(network)) && (
                    (requests && requests.includes(caption.split("#")[0]))
                    || (mappers && Object.keys(mappers).includes(caption))
                    || (oracles && Object.keys(oracles).includes(caption))
                )
            )
        });
}

export function getDefaultUpdateConditions(mainnets?: boolean): any {
    return mainnets ? updateConditions.default.mainnets : updateConditions.default.testnets
}

export function getPriceFeedUpdateConditions(caption: string, network?: string | boolean): any {
    let res: any = {}
    if (network === true) res = updateConditions.default.mainnets;
    else if (!network) res = updateConditions.default.testnets;
    else if (typeof network === "string") {
        res = _utils.isEvmNetworkMainnet(network) ? updateConditions.default.mainnets : updateConditions.default.testnets;
    }
    if (typeof network === "string") {
        framework.utils.getNetworkTagsFromString(network).forEach((network: any) => {
            res = merge(res, network[caption])
        })
        return res
        
    } else {
        Object.values(updateConditions).forEach((network: any) => {
            const specs = network[caption]
            if (specs) {
                Object.entries(specs).forEach(([key, value]) => {
                    if (!isNaN(value as number) && value as number < res[key]) res[key] = value;
                })
            }
        })
        return res
    }
}
