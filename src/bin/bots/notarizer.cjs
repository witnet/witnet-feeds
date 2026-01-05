const { Witnet } = require("@witnet/sdk");

const cron = require("node-cron");
require("dotenv").config({ quiet: true });
const { Command } = require("commander");
const hash = require("object-hash")
const moment = require("moment");
const program = new Command();

const { assets, utils, Rulebook } = require("../../../dist/src/lib");
const { version } = require("../../../package.json");
const { colors, commas, traceHeader } = require("../helpers.cjs");

const CHECK_BALANCE_SCHEDULE =
	process.env.WITNET_PFS_CHECK_BALANCE_SCHEDULE || "*/5 * * * *";
const CHECK_RULEBOOK_SCHEDULE =
	process.env.WITNET_PFS_CHECK_RULEBOOK_SCHEDULE || "0 0 * * *";
const DRY_RUN_POLLING_SECS = process.env.WITNET_PFS_DRY_RUN_POLLING_SECS || 45;
const DRY_RUN_TIMEOUT_SECS = process.env.WITNET_PFS_DRY_RUN_TIMEOUT_SECS || 15;
const WIT_WALLET_MASTER_KEY = process.env.WITNET_PFS_WIT_WALLET_MASTER_KEY || process.env.WITNET_SDK_WALLET_MASTER_KEY;

const lastUpdates = {};
let footprint, priceFeeds, maxCaptionWidth

const metrics = {
	clock: 0,
	errors: 0,
	dryruns: 0,
	inflight: 0,
	nanowits: 0n,
	queries: 0,
}

main();

async function main() {
	program
		.name("npx --package @witnet/price-feeds notarizer")
		.description(
			"Poller bot for detecting and notarizing price feed updates in Witnet.",
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
			"--max-threads <number>",
			"Max. number of simultaneous dry runs",
			process.env.WITNET_PFS_DRY_RUN_MAX_THREADS || 1,
		)
		.option(
			"--min-balance <wits>",
			"Min. balance threshold",
			process.env.WITNET_PFS_WIT_MIN_BALANCE || 1000.0,
		)
		.option(
			"--min-utxos <number>",
			"Min. UTXOs threshold",
			process.env.WITNET_PFS_WIT_MIN_UTXOS || 32,
		)
		.option(
			"--network <evm_network>",
			"Focus only on price feeds deployed in this EVM network",
			undefined,
		)
		.option(
			"--priority <priority>",
			"Network priority",
			process.env.WITNET_PFS_WIT_NETWORK_PRIORITY ||
				Witnet.TransactionPriority.Medium,
		)
		.option(
			"--signer <wit_pkh>",
			"Signer's public key hash",
			process.env.WITNET_PFS_WIT_SIGNER,
		)
		.option(
			"--strategy <strategy>",
			"UTXO selection strategy",
			process.env.WITNET_PFS_WIT_UTXOS_STRATEGY ||
				Witnet.UtxoSelectionStrategy.SlimFit,
		)
		.option(
			'--witnet <"mainnet" | "testnet" | url>',
			"The name of the Witnet network, or the URL of the Wit/RPC provider, to connect to.",
			process.env.WITNET_PFS_WIT_NETWORK ||
				process.env.WITNET_SDK_PROVIDER_URL ||
				"mainnet",
		);

	program.parse();

	let { minBalance } = program.opts();
	const {
		configPath,
		debug,
		maxThreads,
		minUtxos,
		network,
		priority,
		signer,
		strategy,
		witnet,
	} = program.opts();

	traceHeader(`@WITNET/PRICE-FEEDS NOTARIZER BOT v${version}`, colors.white);

	if (!debug) console.debug = () => {};

	if (!WIT_WALLET_MASTER_KEY) {
		console.error(
			`❌ Fatal: a Witnet wallet's master key is not settled for this environment.`,
		);
		process.exit(0);
	}
	const provider =
		witnet === "mainnet"
			? "https://rpc-01.witnet.io"
			: witnet === "testnet"
				? "https://rpc-testnet.witnet.io"
				: witnet;
	const wallet = await Witnet.Wallet.fromXprv(WIT_WALLET_MASTER_KEY, {
		limit: 1,
		strategy,
		provider: await Witnet.JsonRpcProvider.fromURL(provider),
	});
	const ledger = wallet.getSigner(signer || wallet.coinbase.pkh);
	if (!ledger) {
		console.error(
			`❌ Fatal: hot wallet address ${signer} not found in wallet!`,
		);
		process.exit(0);
	}

	console.info(`> Wit/RPC provider:  ${provider}`);
	console.info(
		`> Witnet network:    WITNET:${wallet.provider.network.toUpperCase()} (${wallet.provider.networkId.toString(16)})`,
	);
	console.info(`> Witnet signer:     ${ledger.pkh}`);
	console.info(`> UTXOs strategy:    ${strategy.toUpperCase()}`);
	console.info(`> Network priority:  ${priority.toUpperCase()}`);
	console.info(
		`> Balance threshold: ${Witnet.Coins.fromWits(minBalance).toString(2)}`,
	);

	const VTTs = Witnet.ValueTransfers.from(ledger);

	let balance = Witnet.Coins.fromPedros(0n);
	balance = await checkWitnetBalance();

	minBalance = Witnet.Coins.fromWits(minBalance);
	if (balance.pedros < minBalance.pedros) {
		console.error(
			`❌ Fatal: signer ${ledger.pkh} must be funded with at least ${minBalance.toString(2)}.`,
		);
		process.exit(0);
	} else {
		if (!cron.validate(CHECK_BALANCE_SCHEDULE)) {
			console.error(
				`❌ Fatal: invalid check balance schedule: ${CHECK_BALANCE_SCHEDULE}`,
			);
			process.exit(0);
		}
		console.info(`> Checking balance schedule: ${CHECK_BALANCE_SCHEDULE}`);
		cron.schedule(CHECK_BALANCE_SCHEDULE, async () => checkWitnetBalance());
	}

	if (!cron.validate(CHECK_RULEBOOK_SCHEDULE)) {
		console.error(
			`❌ Fatal: invalid check rulebook schedule: ${CHECK_RULEBOOK_SCHEDULE}`,
		)
		process.exit(0)
	}
	console.info(`> Checking rulebook schedule: ${CHECK_RULEBOOK_SCHEDULE}`);
	cron.schedule(CHECK_RULEBOOK_SCHEDULE, async() => lookupPriceFeeds(network, wallet.provider.network === "mainnet"))

	await lookupPriceFeeds(network, wallet.provider.network === "mainnet")

	if (priceFeeds.length === 0) {
		console.error(
			`❌ Fatal: no price feeds to notarize${network ? ` on ${network.toUpperCase()}.` : "."}`,
		);
		process.exit(0);
	}

	async function notarize(_footprint) {
		if (footprint === _footprint) {
			const batchStart = Date.now()
			let threadBucket = []
			for (const [caption, { request, conditions, lastDryRunClock }] of Object.entries(priceFeeds)) {
				const tag = `witnet:${wallet.provider.network}:${caption}${" ".repeat(maxCaptionWidth - caption.length)}`;

				if (!lastUpdates[caption].timestamp) {
					const lastUpdate = await wallet.provider
						.searchDataRequests(request.radHash, { limit: 16, mode: "ethereal", reverse: true })					
						.then(entries => entries.find(report => report.status === "solved" && report?.result))
						.then(report => {
							if (report) {
								const result = utils.cbor.decode(
									utils.fromHexString(report.result.cbor_bytes),
								);
								if (Number.isInteger(result)) {
									return {
										timestamp: report.result.timestamp,
										value: parseInt(result, 10)
									}
								}
							}
						});
					if (lastUpdate) {
						console.info(`[${tag}] Captured last known update for RAD hash ${request.radHash} => { timestamp: ${lastUpdate.timestamp}, value: ${lastUpdate.value} }`)
						lastUpdates[caption] = lastUpdate
					}
				}
				
				// prepare and spawn new dry-run subprocess:
				const dryRunStart = Date.now();
				metrics.dryruns += 1;
				console.debug(`[${tag}] Dry-running ${lastDryRunClock ? `after ${commas(dryRunStart - lastDryRunClock)} msecs` : `for the first time`} ...`);
				priceFeeds[caption].lastDryRunClock = dryRunStart;
				threadBucket.push(
					request.execDryRun({ timeout: DRY_RUN_TIMEOUT_SECS * 1000 })
					.then(output => {
						if (!output || output === "") throw new Error(`no dry-run report`);
						else return JSON.parse(output);
					})
					.then(json => {
						// parse dry run result
						console.debug(`[${tag}] Dry-run solved in ${commas(Date.now() - dryRunStart)} msecs => ${JSON.stringify(json)}`);
						if (!Object.keys(json).includes("RadonInteger")) {
							throw `Error: unexpected dry run result: ${JSON.stringify(json).slice(0, 2048)}`;
						}
						const currentValue = parseInt(json.RadonInteger, 10);

						// determine whether a new notarization is required
						const heartbeatSecs = Math.floor(Date.now() / 1000) - lastUpdates[caption].timestamp;
						if (heartbeatSecs < conditions.heartbeatSecs / 2 + 1) {
							const deviation =
								lastUpdates[caption].value > 0
									? (100 * (currentValue - lastUpdates[caption].value)) /
										lastUpdates[caption].value
									: 0;
							if (Math.abs(deviation) < conditions.deviationPercentage) {
								metrics.errors -= 1;
								console.info(
									`[${tag}] ${deviation >= 0 ? "+" : ""}${deviation.toFixed(2)} % deviation after ${heartbeatSecs} secs.`
								)
								return;
							} else {
								console.info(
									`[${tag}] Updating due to price deviation of ${deviation.toFixed(2)} % ...`,
								);
							}
						} else {
							console.info(
								`[${tag}] Updating due to heartbeat after ${heartbeatSecs} secs ...`,
							);
						}

						console.debug(`[${tag}] Cache info before sending =>`, ledger.cacheInfo);

						// create, sign and send new data request transaction
						const DRs = Witnet.DataRequests.from(ledger, request);
						metrics.inflight += 1;
						priceFeeds[caption].inflight = (priceFeeds[caption].inflight || 0) + 1;

						// launch promise for the notarization of new price update
						DRs.sendTransaction({
							fees: priority,
							witnesses: conditions.minWitnesses,
						}).then(tx => {
							console.info(`[${tag}] Sending data request transaction => { radHash: ${tx.radHash
								} inputs: ${tx.tx?.DataRequest?.signatures.length
								} cost: ${Witnet.Coins.fromNanowits(tx.fees.nanowits + tx.value?.nanowits).wits
								} weight: ${commas(tx.weight)
								} witnesses: ${tx.witnesses
								} hash: ${tx.hash
								} }`);
							metrics.nanowits += tx.fees.nanowits + tx.value?.nanowits;
							metrics.queries += 1;
							return DRs.confirmTransaction(tx.hash, {
								onStatusChange: () => console.info(`[${tag}] DRT status =>`, tx.status),
							})
						
						}).then(async tx => {
							console.debug(
								`[${tag}] Cache info after confirmation =>`,
								ledger.cacheInfo,
							);

							// await resolution in Witnet
							let status = tx.status;
							do {
								const report = await ledger.provider.getDataRequest(
									tx.hash,
									"ethereal",
								);
								if (report.status !== status) {
									status = report.status;
									console.info(`[${tag}] DRT status =>`, report.status);
								}
								if (report.status === "solved" && report?.result) {
									const result = utils.cbor.decode(
										utils.fromHexString(report.result.cbor_bytes),
									);
									if (Number.isInteger(result)) {
										lastUpdates[caption].timestamp = report.result.timestamp;
										lastUpdates[caption].value = parseInt(result, 10);
										const { value, timestamp } = lastUpdates[caption]
										const providers = request.sources
											.map(source => {
												let parts = source.authority.split(".").slice(-2);
												parts[0] = parts[0][0].toUpperCase() + parts[0].slice(1);
												return parts.join(".")
											})
											.sort();
										console.info(`[${tag}] DRT result => { value: ${value}, ts: ${moment.unix(timestamp).format("MMM Do YYYY HH:mm:ss")}, providers: ${providers.join(" ")} }`);
									} else {
										throw `Unexpected DRT result => ${result}`;
									}
									break;
								}
								const delay = (ms) =>
									new Promise((_resolve) => setTimeout(_resolve, ms));
								await delay(5000);
							} while (status !== "solved");
						
						}).then(() => {
							priceFeeds[caption].inflight -= 1;
							metrics.inflight -= 1;
						
						}).catch(err => {
							priceFeeds[caption].inflight -= 1;
							metrics.inflight -= 1;	
							metrics.errors += 1;
							console.error(`[${tag}] Notarization failed: ${err}`);
						});
					})
					.catch(err => {
						console.warn(`[${tag}] ${debug ? `(after ${commas(Date.now() - dryRunStart)} msecs) ` : " "}Dry-run failed: ${err}`);
						metrics.errors += 1; 
					})
				);
				
				if (threadBucket.length >= maxThreads) {
					await Promise.all(threadBucket)
					threadBucket = []
				}
			}
			if (threadBucket.length) {
				await Promise.all(threadBucket)
			}
			
			const elapsed = Date.now() - batchStart;
			const remaining = DRY_RUN_POLLING_SECS * 1000 - elapsed;
			const timeout = Math.max(remaining, 0);
			console.debug(`[footprint::${_footprint}] Dry run of ${Object.keys(priceFeeds).length} price feeds took ${commas(elapsed)} msecs to accomplish.`)
			if (timeout > 0) console.info(`[footprint::${_footprint}] Next dry run batch in ${commas(timeout)} msecs ...`);
			setTimeout(() => notarize(_footprint), timeout);
		
		} else {
			// live and let die
		}
	}

	async function checkWitnetBalance() {
		try {
			let newBalance = Witnet.Coins.fromPedros(
				(await ledger.getBalance()).unlocked,
			);
			const now = Math.floor(Date.now() / 1000);
			const increased = newBalance.nanowits > balance?.nanowits || 0n;
			const utxos = (await ledger.getUtxos(increased)).filter(
				(utxo) => utxo.timelock <= now,
			);
			if (increased && utxos.length < minUtxos * 2) {
				const totalSplits = minUtxos * 2;
				const iters = BigInt(Math.ceil(totalSplits / 32));
				let remaining = totalSplits;
				for (let ix = 0; ix < iters; ix++) {
					const splits = Math.min(remaining, 32);
					remaining -= splits;
					let fees = 10000n;
					const recipients = [];
					const value = Witnet.Coins.fromPedros(
						(newBalance.pedros / iters - fees * iters) / BigInt(splits),
					);
					fees += (newBalance.pedros / iters - fees * iters) % BigInt(splits);
					recipients.push(...Array(splits).fill([ledger.pkh, value]));
					const receipt = await VTTs.sendTransaction({
						recipients,
						fees: Witnet.Coins.fromPedros(fees),
					});
					console.info(JSON.stringify(receipt.tx, utils.txJsonReplacer, 4));
					await VTTs.confirmTransaction(receipt.hash, {
						onStatusChange: (receipt) => {
							console.info(
								`> Splitting UTXOs => ${receipt.hash} [${receipt.status}]`,
							);
						},
					});
					newBalance = Witnet.Coins.fromPedros(
						(await ledger.getBalance()).unlocked,
					);
				}
			}
			balance = newBalance;
		} catch (err) {
			console.error(
				`[witnet:${wallet.provider.network}:${ledger.pkh}] Cannot check balance: ${err}`,
			);
			/* FORCE TERMINATION */ process.exit(0);
		}
		console.info(
			`[witnet:${wallet.provider.network}:${ledger.pkh}] Balance: ${balance.toString(2)} (${ledger.cacheInfo.size} UTXOs)`,
		);
		if (balance.pedros < minBalance.pedros)
			console.warn(
				`[witnet:${wallet.provider.network}:${ledger.pkh}] Low funds !!!`,
			);
		if (ledger.cacheInfo.size < minUtxos)
			console.warn(
				`[witnet:${wallet.provider.network}:${ledger.pkh}] Low UTXOs !!!`,
			);

		const runningSecs = metrics.clock ? Math.floor(Date.now() / 1000) - metrics.clock : 0
		const runningWits = Witnet.Coins.fromNanowits(metrics.nanowits).wits;
		let status
		try {
			const syncStatus = await wallet.provider.syncStatus()
			if (syncStatus.node_state !== "Synced") {
				status = `wit-syncing`
			} else {
				if (ledger.cacheInfo.size < minUtxos) {
					status = `wit-utxos-low`
				} else if (balance.pedros < minBalance.pedros) {
					status = `wit-balance-low`
				} else if (!metrics.clock) {
					metrics.clock = Math.floor(Date.now() / 1000)
					status = `up-and-restarted`
				} else {
					status = `up-and-running`
				}
			}
		} catch {
			status = `wit-disconnect`
		}
		console.info(`${JSON.stringify({
			...(runningSecs > 0 ? {
				footprint,
				priceFeeds: priceFeeds ? Object.keys(priceFeeds).length : 0,
				hourlyQueries: Math.ceil(3600 * metrics.queries / runningSecs),
				hourlyWits: Number(3600 * runningWits / runningSecs),
			}: {}),
			errors: metrics.errors,
			pendingRequests: metrics.inflight,
			runningDryruns: metrics.dryruns,
			runningQueries: metrics.queries,
			runningSecs,
			runningWits,
			signer: ledger.pkh,
			signerBalance: Witnet.Coins.fromNanowits(ledger.cacheInfo.expendable).wits,
			signerUtxos: ledger.cacheInfo.size, 
			status,
			version,
		})}`);
		// reset interval errors
		metrics.errors = 0
		return balance;
	}

	async function lookupPriceFeeds(network, mainnets) {
		const captions = [];
		const rulebook = configPath
			? await Rulebook.fromUrlBase(configPath)
			: Rulebook.default();
		const pfs = rulebook.getNetworkPriceFeeds(network);
		const newFootprint = hash(pfs)
		if (newFootprint !== footprint) {
			footprint = newFootprint
			console.info(
				`[witnet:${wallet.provider.network}] Price feeds rulebook hash changed to ${footprint}:`
			);
			priceFeeds = Object.fromEntries(
				Object.entries(pfs.oracles)
					.filter(([, oracle]) => oracle.class === "witnet" && oracle.target === undefined)
					.map(([caption, oracle]) => {
						caption = caption.split("#")[0];
						captions.push(caption);
						const artifact = oracle.sources || utils.captionToWitOracleRequestPrice(caption);
						let request;
						try {
							request = utils.requireRadonRequest(artifact, assets);
						} catch (err) {
							console.error(
								`❌ Fatal: cannot load Radon Request for artifact ${artifact} (${caption}):\n${err}`,
							);
							process.exit(0);
						}
						const conditions = rulebook.getPriceFeedUpdateConditions(
							caption,
							mainnets,
						);
						const networks = rulebook.getPriceFeedNetworks(caption, mainnets);
						return [
							caption,
							{ artifact, request, conditions, networks, lastUpdate: {} },
						];
					})
					.filter(
						([, { request, networks }]) =>
							request !== undefined && networks.length > 0,
					)
					.sort(([a], [b]) => a.localeCompare(b)),
				);
			maxCaptionWidth = Math.max(
				...Object.keys(priceFeeds).map((caption) => caption.length),
			);
			for (const [caption, {conditions}] of Object.entries(priceFeeds)) {
				lastUpdates[caption] = { value: 0, timestamp: 0 };
				console.info(
					`[${caption}${" ".repeat(maxCaptionWidth - caption.length)}] Update conditions: { deviation: ${conditions.deviationPercentage.toFixed(
						1,
					)} %, heartbeat: ${commas(conditions.heartbeatSecs

					)} ", cooldown: ${commas(conditions.cooldownSecs

					)} ", witnesses: ${conditions.minWitnesses} }`,
				);
			}
			notarize(footprint)
		} else {
			console.info(
				`[witnet:${wallet.provider.network}] Price feeds rulebook hash remains the same: ${footprint}`
			);
		}
	}
}
