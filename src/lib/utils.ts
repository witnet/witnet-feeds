import { default as helpers } from "../bin/helpers.cjs";

export * from "@witnet/solidity/utils";

export function captionToWitOracleRequestPrice(caption: string) {
	let prefix = "";
	const symbol = caption.split("#")[0] || "";
	const dashes = symbol.split("-");
	const decimals = dashes.pop() || "";
	const slashes = dashes.pop()?.split("/") || dashes;
	const quote = slashes?.pop() || "";
	let base = slashes?.pop() || "";
	if (base.toLowerCase().indexOf("price-") >= 0) {
		base = base.split("-").pop() || "";
	} else if (base.indexOf(".") >= 0) {
		const dots = base.split(".");
		base = dots.pop() || "";
		prefix = dots.pop() || "";
	}
	return `WitOracleRequestPrice${helpers.camelize(prefix)}${helpers.camelize(
		base,
	)}${helpers.camelize(quote)}${helpers.camelize(decimals)}`;
}
