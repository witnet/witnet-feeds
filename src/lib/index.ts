import { existsSync, readFileSync } from "node:fs";
import merge from "lodash.merge";

import { default as helpers } from "../bin/helpers.cjs";
import * as _utils from "./utils.js";

export { default as assets } from "../../witnet/assets/index.cjs";
export * as utils from "./utils.js";

import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export class Rulebook {
	public readonly priceFeeds;
	public readonly updateConditions;

	protected _networks;
	protected _networksPriceFeeds;

	public static default(): Rulebook {
		const updateConditions = require("../../witnet/updateConditions.json");
		const priceFeeds = require("../../witnet/priceFeeds.json");
		return new Rulebook(priceFeeds, updateConditions);
	}

	public static workspace(): Rulebook {
		const { priceFeeds, updateConditions } = helpers.readWitnetJsonFiles(
			"priceFeeds",
			"updateConditions",
		);
		return new Rulebook(priceFeeds, updateConditions);
	}

	public static fromFilePath(path: string): Rulebook {
		const { priceFeeds, updateConditions } = Object.fromEntries(
			["priceFeeds", "updateConditions"].map((key) => {
				const filepath = `${path}/${key}.json`;
				if (!existsSync(filepath)) {
					throw new Error(`Rulebook: file not found: ${filepath}`);
				}
				const rules = readFileSync(filepath, { encoding: "utf-8" });
				return [key, existsSync(filepath) ? JSON.parse(rules) : {}];
			}),
		);
		return new Rulebook(priceFeeds, updateConditions);
	}

	public static async fromUrlBase(urlBase: string): Promise<Rulebook> {
		if (urlBase.startsWith("http")) {
			const [priceFeeds, updateConditions] = await Promise.all([
				fetch(`${urlBase}/priceFeeds.json`).then(res => res.json()),
				fetch(`${urlBase}/updateConditions.json`).then(res => res.json()),
			]);
			return new Rulebook(priceFeeds, updateConditions);
		} else {
			return Rulebook.fromFilePath(urlBase);
		}
	}

	constructor(priceFeeds: any, updateConditions: any) {
		this.priceFeeds = priceFeeds;
		this.updateConditions = updateConditions;
		this._networks = _utils.getEvmNetworks();
		this._networksPriceFeeds = Object.fromEntries(
			_utils.getEvmNetworks().map((network) => {
				const pfs = this._getNetworkPriceFeeds(network);
				pfs.mappers = Object.fromEntries(
					Object.entries(pfs.mappers).filter(([key, mapper]) => {
						const deps = ((mapper as any).deps as string[]) || [];
						return deps.every(
							(caption) =>
								(pfs.requests.includes(caption) &&
									!pfs.requests.includes(key)) ||
								(Object.keys(pfs.oracles).includes(caption) &&
									!Object.keys(pfs.oracles).includes(key)) ||
								Object.keys(pfs.mappers).includes(caption),
						);
					}),
				);
				for (let runs = 0; runs < 2; runs++) {
					pfs.mappers = Object.fromEntries(
						Object.entries(pfs.mappers).filter(([, mapper]) => {
							const deps = ((mapper as any).deps as string[]) || [];
							return deps.every(
								(caption) =>
									pfs.requests.includes(caption) ||
									Object.keys(pfs.mappers).includes(caption) ||
									Object.keys(pfs.oracles).includes(caption),
							);
						}),
					);
				}
				return [network, pfs];
			}),
		);
	}

	_getNetworkPriceFeeds(network: string): any {
		const res = { ...this.priceFeeds.default };
		if (!res.requests) res.requests = [];
		_utils.getNetworkTagsFromString(network).forEach((network: string) => {
			const tmp = this.priceFeeds[network];
			res.mappers = merge(res?.mappers, tmp?.mappers);
			res.oracles = merge(res?.oracles, tmp?.oracles);
			res.requests = [
				...new Set([...(res?.requests || []), ...(tmp?.requests || [])]),
			];
		});
		return { ...res };
	}

	public getNetworkPriceFeeds(network?: string): any {
		if (network) {
			return this._networksPriceFeeds[network];
		} else {
			const res: any = {};
			res.mappers = {};
			res.oracles = {};
			res.requests = [];
			(
				Object.values(this.priceFeeds) as Array<{
					mappers: any;
					oracles: any;
					requests: string[];
				}>
			).forEach((section: any) => {
				res.mappers = merge(res?.mappers, section?.mappers);
				res.oracles = merge(res?.oracles, section?.oracles);
				res.requests.push(...(section?.requests || []));
			});
			return res;
		}
	}

	public getPriceFeedNetworks(caption: string, mainnets: boolean): string[] {
		return this._networks.filter((network: string) => {
			const { requests, mappers, oracles } = this._networksPriceFeeds[network];
			return (
				!(mainnets !== _utils.isEvmNetworkMainnet(network)) &&
				(requests?.includes(caption.split("#")[0]) ||
					(mappers && Object.keys(mappers).includes(caption)) ||
					(oracles && Object.keys(oracles).includes(caption)))
			);
		});
	}

	public getDefaultUpdateConditions(mainnets?: boolean): any {
		return mainnets
			? this.updateConditions.default.mainnets
			: this.updateConditions.default.testnets;
	}

	public getPriceFeedUpdateConditions(
		caption: string,
		network?: string | boolean,
	): any {
		let res: any = {};
		if (network === true) res = this.updateConditions.default.mainnets;
		else if (!network) res = this.updateConditions.default.testnets;
		else if (typeof network === "string") {
			res = _utils.isEvmNetworkMainnet(network)
				? this.updateConditions.default.mainnets
				: this.updateConditions.default.testnets;
		}
		if (typeof network === "string") {
			_utils.getNetworkTagsFromString(network).forEach((network: any) => {
				res = merge(res, network[caption]);
			});
			return res;
		} else {
			Object.values(this.updateConditions).forEach((network: any) => {
				const specs = network[caption];
				if (specs) {
					Object.entries(specs).forEach(([key, value]) => {
						if (!Number.isNaN(value as number) && (value as number) < res[key])
							res[key] = value;
					});
				}
			});
			return res;
		}
	}
}
