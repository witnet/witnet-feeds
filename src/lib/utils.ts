import { camelize } from "../helpers.js"

export * from "@witnet/ethers/utils"

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
