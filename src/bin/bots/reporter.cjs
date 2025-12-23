const { Witnet } = require("@witnet/sdk");
const { ethers, WitOracle } = require("@witnet/solidity");

const cron = require("node-cron");
require("dotenv").config({ quiet: true });
const { Command } = require("commander");
const program = new Command();

const { utils, Rulebook } = require("../../../dist/src/lib");
const { version } = require("../../../package.json");
const { colors, commas, traceHeader } = require("../helpers.cjs");

const CHECK_BALANCE_SCHEDULE =
	process.env.WITNET_PFS_CHECK_BALANCE_SCHEDULE || "*/5 * * * *";
const DRY_RUN_POLLING_SECS = process.env.WITNET_PFS_DRY_RUN_POLLING_SECS || 45;
const DRY_RUN_TIMEOUT_SECS = 15;
const KERMIT = process.env.WITNET_SDK_KERMIT_URL || "https://kermit.witnet.io";

let balance,
	footprint,
	priceFeeds = [],
	maxCaptionWidth;
let pendingUpdates = [];
let rulebook;

const metrics = {
	clock: 0,
	eth: 0,
	dryruns: 0,
	reports: 0,
}

traceHeader(`@WITNET/PRICE-FEEDS EVM REPORTER BOT v${version}`, colors.white);

main();

async function main() {
	program
		.name("npx --package @witnet/price-feeds reporter")
		.description(
			"Poller bot for reporting notarized price feed updates into a WitPriceFeeds contract.",
		)
		.version(version);

	program
		.option(
			"--config-path <path>",
			"URL or file subpath where to locate rulebook JSON files",
			process.env.WITNET_PFS_RULEBOOK_PATH || undefined,
		)
		.option("--debug", "Trace debug logs")
		.option(
			"--gas-limit <gas>",
			"Max. gas to spend upon updates",
			process.WITNET_PFS_ETH_GAS_LIMIT,
		)
		.option(
			"--host <url>",
			"ETH/RPC provider host",
			process.env.WITNET_PFS_ETH_RPC_PROVIDER_HOST || "http://127.0.0.1",
		)
		.option(
			"--patron <evm_address>",
			"Signer address that will pay for every update report, other than the gateway's default.",
			process.env.WITNET_PFS_ETH_SIGNER || undefined,
		)
		.option(
			"--port <url>",
			"ETH/RPC provider port",
			process.env.WITNET_PFS_ETH_RPC_PROVIDER_PORT || 8545,
		)
		.option(
			"--min-balance <eth>",
			"Min. balance threshold",
			process.env.WITNET_PFS_ETH_MIN_BALANCE || 0.001,
		)
		.option(
			"--max-gas-price <gwei>",
			"Max. network gas price to pay upon updates",
			process.env.WITNET_PFS_ETH_MAX_GAS_PRICE_GWEI || undefined,
		)
		.option(
			"--network <evm_network>",
			"Make sure the randomizer bot connects to this EVM chain.",
			process.env.WITNET_PFS_ETH_NETWORK || undefined,
		)
		.requiredOption(
			"--target <evm_address>",
			"Address of WitPriceFeeds contract where to report data updates.",
			process.env.WITNET_PFS_ETH_TARGET || undefined,
		)
		.option(
			"--witnet <url>",
			"The WIT/RPC provider endpoint where to search for notarized data updates, other than the officials .",
			process.env.WITNET_PFS_WIT_NETWORK,
		);

	program.parse();

	let {
		configPath,
		debug,
		gasLimit,
		host,
		minBalance,
		maxGasPriceGwei,
		network,
		port,
		patron,
		target,
		witnet,
	} = program.opts();

	if (!debug) console.debug = () => {};

	if (patron && !ethers.isAddress(patron)) {
		console.error(`❌ Fatal: invalid EVM signer address: "${patron}"`);
		process.exit(0);
	} else if (!target || !ethers.isAddress(target)) {
		console.error(`❌ Fatal: invalid EVM target address: "${target}"`);
		process.exit(0);
	}

	const witOracle = patron
		? await WitOracle.fromJsonRpcUrl(`${host}:${port}`, patron)
		: await WitOracle.fromJsonRpcUrl(`${host}:${port}`);
	const signer = witOracle.signer.address;

	if (network && witOracle.network !== network) {
		console.error(
			`❌ Fatal: connected to ${witOracle.network.toUpperCase()} instead of ${network.toUpperCase()}`,
		);
		process.exit(0);
	} else {
		network = witOracle.network;
	}

	const witOracleRadonRegistry = await witOracle
		.getWitOracleRadonRegistry()
		.catch((err) => {
			console.error(`❌ Fatal: cannot fetch Wit/Oracle Radon Registry: ${err}`);
			process.exit(0);
		});

	const _witnet = await Witnet.JsonRpcProvider.fromURL(
		witnet ||
			(utils.isEvmNetworkMainnet(network)
				? "https://rpc-02.witnet.io"
				: "https://rpc-testnet.witnet.io"),
	);
	if ((_witnet.network === "mainnet") ^ utils.isEvmNetworkMainnet(network)) {
		console.error(
			`❌ Fatal: invalid Witnet network at ${
				_witnet.endpoints
			}: should connect to the ${
				utils.isEvmNetworkMainnet(network) ? "MAINNET" : "TESTNET"
			} instead.`,
		);
		process.exit(0);
	}
	const kermit = await Witnet.KermitClient.fromEnv(KERMIT);

	console.info(`> WIT/Kermit URL:   ${kermit.url}`);
	console.info(`> WIT/RPC provider: ${_witnet.endpoints}`);
	console.info(`> EVM RPC gateway:  ${host}:${port}`);
	console.info(`> EVM network:      ${network.toUpperCase()}`);

	const witPriceFeeds = await witOracle
		.getWitPriceFeedsAt(target)
		.catch((err) => {
			console.error(`❌ Fatal: ${err}`);
			process.exit(0);
		});

	const [artifact, serial] = await Promise.all([
		witPriceFeeds.getEvmImplClass(),
		witPriceFeeds.getEvmImplVersion(),
	]);
	if (!artifact.startsWith("WitPriceFeeds")) {
		console.error(`❌ Fatal: invalid target artifact: ${target}`);
		process.exit(0);
	} else if (!serial.startsWith("3.")) {
		console.error(`❌ Fatal: unsupported WitPriceFeeds version: ${serial}`);
		process.exit(0);
	}

	console.info(`> Wit/Oracle bridge:    ${witOracle.address}`);
	console.info(`> Wit/Oracle registry:  ${witOracleRadonRegistry.address}`);
	console.info(
		`> Wit/Oracle appliance: ${target} [${artifact} v${serial.split("-")[0]}]`,
	);

	const { provider } = witOracle;
	const symbol = utils.getEvmNetworkSymbol(network);
	balance = await provider.getBalance(signer);
	minBalance = BigInt(minBalance * 1e18);

	console.info(
		`[${signer}] Balance threshold: ${ethers.formatEther(minBalance)} ${symbol}`,
	);
	console.info(
		`[${signer}] Initial balance:   ${ethers.formatEther(balance)} ${symbol}`,
	);

	if (balance < BigInt(minBalance)) {
		console.error(
			`❌ Fatal: the signer address must be funded with at least ${minBalance} ${symbol}`,
		);
		process.exit(0);
	} else {
		if (!cron.validate(CHECK_BALANCE_SCHEDULE)) {
			console.error(
				`❌ Fatal: invalid check balance schedule: ${CHECK_BALANCE_SCHEDULE}`,
			);
			process.exit(0);
		}
		console.info(
			`[${signer}] Checking balance schedule: ${CHECK_BALANCE_SCHEDULE}`,
		);
		cron.schedule(CHECK_BALANCE_SCHEDULE, async () => checkBalance());
	}

	console.info(
		`[${witPriceFeeds.address}] Purging pending updates every ${DRY_RUN_POLLING_SECS} seconds ...`,
	);
	setInterval(purgePendingUpdates, DRY_RUN_POLLING_SECS * 1000);

	checkBalance()

	async function checkBalance() {
		// check balance
		try {
			const newBalance = await provider.getBalance(signer);
			if (newBalance > balance) {
				console.info(
					`[${network}:${signer}] Balance increased +${ethers.formatEther(newBalance - balance)} ${symbol}`,
				);
			}
			balance = newBalance;
		} catch (err) {
			console.warn(`[${network}:${signer}] Cannot check balance: ${err}`);
			metrics.errors += 1;
		}

		console.info(
			`[${network}:${signer}] Balance: ${ethers.formatEther(balance)} ${symbol}`,
		);
		if (balance < minBalance) {
			console.warn(`[${network}:${signer}] Low funds !!!`);
		}

		// trace metrics
		const runningSecs = metrics.clock ? Math.floor(Date.now() / 1000) - metrics.clock : 0
		let status
		try {
			const syncStatus = await _witnet.syncStatus()
			if (syncStatus.node_state !== "Synced") {
				status = `wit-syncing`
			
			} else {
				try {
					await provider.getBalance(signer) 
					if (!metrics.clock) {
						metrics.clock = Math.floor(Date.now() / 1000)
						status = `up-and-restarted`
					
					} else if (balance < minBalance) {
						status = `eth-balance-low`
					
					} else {
						status = `up-and-running`
					}
				} catch {
					status = `eth-disconnect`
				}
			}
		} catch {
			status = `wit-disconnect`
		}
		const signerBalance = Number(balance) / 10 ** 18;
		console.info(`${JSON.stringify({
			...(runningSecs > 0 ? {
				footprint,
				priceFeeds: priceFeeds.length,
				hourlyEth: Number(3600 * metrics.eth / runningSecs),
				hourlyReports: Math.ceil(3600 * metrics.reports / runningSecs),
				leftHours: signerBalance / Number(3600 * metrics.eth / runningSecs),
			}: {}),
			errors: metrics.errors,
			pendingUpdates: pendingUpdates.length,
			runningEth: metrics.eth,
			runningDryruns: metrics.dryruns,
			runningReports: metrics.reports,
			runningSecs,
			signer,
			signerBalance,
			status,
			symbol,
			target,
			version,
		})}`);
		// reset interval errors
		metrics.errors = 0

		
		// check for eventual changes in the price feeds rulebook
		await lookupPriceFeeds();
	}

	async function lookupPriceFeeds() {
		// try to reload deviations thresholds, which are not stored on-chain but only in the book of rules
		try {
			const newRulebook = configPath
				? await Rulebook.fromUrlBase(configPath)
				: Rulebook.default();
			rulebook = newRulebook;
			console.debug(
				`[${network}:${signer}] Reloaded deviation threshold rules.`,
			);
		} catch (err) {
			console.warn(`[${network}:${signer}] Cannot reload Rulebook: ${err}`);
			metrics.errors += 1;
		}
		// check footprint
		try {
			const newFootprint = await witPriceFeeds.getEvmFootprint();
			if (newFootprint !== footprint) {
				footprint = newFootprint;
				console.info(
					`[${witPriceFeeds.address}] Price feeds footprint changed to ${footprint}:`
				);

				const pfs = await witPriceFeeds
					.lookupPriceFeeds()
					.then((pfs) =>
						pfs
							.filter((pf) => pf.oracle && pf.oracle.class === "Witnet")
							.map((pf) => {
								const caption = pf.symbol.split("#")[0];
								const conditions = rulebook.getPriceFeedUpdateConditions(
									pf.symbol,
									network,
								);
								return {
									...pf,
									updateConditions: {
										...pf.updateConditions,
										deviationPercentage: conditions.deviationPercentage,
									},
									caption,
									footprint,
								};
							}),
					)
					.catch((err) => {
						throw err
					});

				maxCaptionWidth = Math.max(...pfs.map(({ caption }) => caption.length));
				priceFeeds = Object.fromEntries(
					await Promise.all(
						pfs.map(async (pf) => {
							const radHash = pf.oracle.sources;
							const bytecode =
								await witOracleRadonRegistry.lookupRadonRequestBytecode(
									radHash,
								);
							const request = Witnet.Radon.RadonRequest.fromBytecode(bytecode);
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
								},
							];
						}),
					),
				);
				for (const [caption, { id4, conditions }] of Object.entries(priceFeeds)) {
					console.info(
						`[${network}:${id4}:${caption}${" ".repeat(maxCaptionWidth - caption.length)}] Update conditions: { cooldown: ${
							conditions.cooldownSecs
						}", deviation: ${conditions.deviationPercentage.toFixed(
							1,
						)}%, heartbeat: ${conditions.heartbeatSecs}", minWitnesses: ${
							conditions.minWitnesses
						} }`,
					);
					dryRunPriceFeed(caption, footprint);
					const delay = (ms) =>
						new Promise((_resolve) => setTimeout(_resolve, ms));
					await delay((1 + Math.floor(Math.random() * 5)) * 1000);
				};
			}
		} catch (err) {
			console.warn(`[${network}:${signer}] Cannot fetch price feeds from contract: ${err}`);
			metrics.errors += 1;
		}
	}

	async function dryRunPriceFeed(caption, _footprint) {
		if (priceFeeds[caption] && priceFeeds[caption].footprint === _footprint) {
			const { conditions, id4, exponent, radHash, request, lastUpdate } =
				priceFeeds[caption];
			const tag = `${network}:${id4}:${caption}${" ".repeat(maxCaptionWidth - caption.length)}`;
			try {
				metrics.dryruns += 1
				// determine whether polling for notarized update is required
				const heartbeatSecs =
					Math.floor(Date.now() / 1000) - Number(lastUpdate.timestamp);
				if (heartbeatSecs < conditions.heartbeatSecs) {
					let dryrun = JSON.parse(await request.execDryRun({ timeout: DRY_RUN_TIMEOUT_SECS * 1e3 }));
					if (!Object.keys(dryrun).includes("RadonInteger")) {
						throw `Error: unexpected dry run result: ${JSON.stringify(dryrun)}`;
					} else {
						dryrun = parseInt(dryrun.RadonInteger, 10);
					}
					const deviation =
						lastUpdate.price > 0
							? (100 * (dryrun / 10 ** -exponent - lastUpdate.price)) /
								lastUpdate.price
							: 0;
					if (Math.abs(deviation) < conditions.deviationPercentage) {
						throw `${deviation >= 0 ? "+" : ""}${deviation.toFixed(2)} % deviation after ${heartbeatSecs} secs.`;
					} else {
						console.info(
							`[${tag}] Searching latest update due to a price deviation of ${deviation.toFixed(2)} % ...`,
						);
					}
				} else {
					console.info(
						`[${tag}] Searching latest update due to heartbeat after ${heartbeatSecs} secs ...`,
					);
				}
				console.info(`[${tag}] [>] RAD hash: ${radHash.slice(2)}`);
				const since = -Math.ceil(conditions.heartbeatSecs / 20);
				await _witnet
					.searchDataRequests(radHash.slice(2), {
						limit: 16,
						mode: "ethereal",
						since,
						reverse: true,
					})
					.then(async (dataRequests) => {
						try {
							dataRequests = dataRequests.filter(
								(report) =>
									report.query?.witnesses >= conditions.minWitnesses &&
									report.result &&
									// && report.result.finalized
									report.result.cbor_bytes &&
									Number.isInteger(
										utils.cbor.decode(report.result.cbor_bytes),
									) &&
									BigInt(report.result.timestamp) > lastUpdate.timestamp,
							);
							if (dataRequests.length > 0) {
								const report = await kermit.getDataPushReport(
									dataRequests[0].hash,
									network,
								);
								const { hash, result } = report;
								console.info(`[${tag}] [<] DRT hash: ${hash}`);
								const price = parseInt(
									utils.cbor.decode(result.cbor_bytes),
									10,
								);
								const freshness =
									Math.floor(Date.now() / 1000) - Number(result.timestamp);
								console.info(
									`[${tag}] [<] Queued report: { price: ${Number(price) / 10 ** (-exponent)}, timestamp: ${result.timestamp}, freshness: ${freshness}" }`,
								);
								// console.debug(`[${tag}] [<] Signed report: ${JSON.stringify(report, null, 4)}`)
								const index = pendingUpdates.findIndex(
									(task) => task.id4 === id4,
								);
								if (index >= 0) {
									pendingUpdates[index] = { id4, caption, report };
								} else {
									pendingUpdates.push({ id4, caption, report });
								}
							} else {
								console.info(`[${tag}] [<] No recent updates found just yet.`);
							}
						} catch (err) {
							throw `[x] Cannot fetch signed report from ${kermit.url}: ${err}`;
						}
					})
					.catch((err) => console.warn(`[${tag}] ${err}`));
			
			} catch (err) {
				console.warn(`[${tag}] ${err}`);
				metrics.errors += 1;
			}
			
			setTimeout(
				() => dryRunPriceFeed(caption, _footprint),
				DRY_RUN_POLLING_SECS * 1000,
			);
		
		} else {
			// live and let die
		}
	}

	async function purgePendingUpdates() {
		try {
			const tasks = [...pendingUpdates];
			pendingUpdates = [];
			for (let index = 0; index < tasks.length; index++) {
				const { id4, caption, report } = tasks[index];
				const tag = `${network}:${id4}:${caption}${" ".repeat(maxCaptionWidth - caption.length)}`;
				if (priceFeeds[caption]) {
					let lastUpdate = await witPriceFeeds.getPriceUnsafe(id4);
					const priceFeed = priceFeeds[caption];
					const elapsed =
						Math.floor(Date.now() / 1000) - Number(lastUpdate.timestamp);
					if (`0x${report.hash}` === lastUpdate.trail) {
						console.warn(
							`[${tag}] Ignoring on-chain update [${report.hash}] because it's already pushed.`,
						);
					
					} else if (elapsed <= priceFeed.conditions.cooldownSecs) {
						console.info(
							`[${tag}] Postponing on-chain update [${report.hash}] +${priceFeed.conditions.cooldownSecs - elapsed} secs due to cooldown condition.`,
						);
					
					} else {
						console.info(`[${tag}] Reporting update [${report.hash}] after ${elapsed} secs ...`);
						const receipt = await witPriceFeeds
							.pushDataReport(report, {
								gasLimit,
								maxGasPrice: maxGasPriceGwei ? BigInt(Number(maxGasPriceGwei) * 10 ** 9) : undefined,
								onTransaction: (hash) => {
									console.info(`[${tag}] [>] EVM tx hash: ${hash} ...`);
								},
								onTransactionReceipt: (receipt) => {
									console.info(
										`[${tag}] [>] EVM gas price: ${ethers.formatUnits(receipt.gasPrice, 9)} gwei`,
									);
									console.info(
										`[${tag}] [>] EVM gas used:  ${commas(receipt.gasUsed)}`,
									);
								},
							})
							.then(receipt => {
								metrics.reports += 1;
								metrics.eth += Number(receipt.gasPrice) * Number(receipt.gasUsed) / 10 ** 18
								const intf = new ethers.Interface(witPriceFeeds.abi)
								const logs = receipt.logs
									.filter(log => log.topics[0] === "0x0800977f281a92a8fb15f0b059791b2ffcc82fdc78be5227cec46afdb45f947d")
									.map(log => intf.parseLog(log));
								if (logs.length > 0) {
									lastUpdate = {
										price: Number(logs[0].args[3]),
										deltaPrice: Number(logs[0].args[4]),
										exponent: Number(logs[0].args[5]),
										timestamp: Number(logs[0].args[1]),
										trail: logs[0].args[2]
									}
								}	
								return receipt
							})
							.catch((err) => {
								console.warn(`[${tag}] [x] ${err}`);
							})
						
						if (
							!receipt &&
							priceFeed.lastUpdate.timestamp > lastUpdate.timestamp &&
							pendingUpdates.findIndex((task) => task.id4 === id4) < 0
						) {
							pendingUpdates.push(tasks[index]);
						}
						priceFeeds[caption].lastUpdate = lastUpdate;
						if (receipt) {
							console.info(
								`[${tag}] [<] Pushed update: ${JSON.stringify(lastUpdate)}`,
							);
						} else {
							console.info(
								`[${tag}] <== Last pushed update: ${JSON.stringify(lastUpdate)}`,
							);
						}
					}
				}
			}
		} catch (err) {
			console.warn(
				`[${network}:${witPriceFeeds.address}] Error while purging updates: ${err}`,
			);
		}
	}
}
