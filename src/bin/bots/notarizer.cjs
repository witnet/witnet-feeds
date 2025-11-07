const { Witnet } = require("@witnet/sdk");

const cron = require("node-cron");
require("dotenv").config({ quiet: true });
const { Command } = require("commander");
const program = new Command();

const { assets, utils, Rulebook } = require("../../../dist/src/lib");
const { version } = require("../../../package.json");
const { colors, commas, traceHeader } = require("../helpers.cjs");

const CHECK_BALANCE_SCHEDULE =
	process.env.WITNET_PFS_CHECK_BALANCE_SCHEDULE || "*/5 * * * *";
const DRY_RUN_POLLING_SECS = process.env.WITNET_PFS_DRY_RUN_POLLING_SECS || 45;
const WIT_WALLET_MASTER_KEY = process.env.WITNET_SDK_WALLET_MASTER_KEY;

const lastUpdates = {};

main();

async function main() {

	program
		.name("npx --package @witnet/price-feeds notarizer")
		.description("Poller bot for detecting and notarizing price feed updates in Witnet.")
		.version(version);

	program
		.option(
			"--config-path <path>",
			"URL or file subpath where to locate rulebook JSON files",
		)
		.option("--debug", "Trace debug logs")
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
			"--witnet <\"mainnet\" | \"testnet\" | url>",
			"The name of the Witnet network, or the URL of the Wit/RPC provider, to connect to.",
			process.env.WITNET_PFS_WIT_NETWORK 
				|| process.env.WITNET_SDK_PROVIDER_URL
				|| "mainnet"
		);

	program.parse();

	let { minBalance } = program.opts()
	const {
		configPath,
		debug,
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
	const provider = witnet === "mainnet" ? "https://rpc-01.witnet.io" : (witnet === "testnet" ? "https://rpc-testnet.witnet.io" : witnet)
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

	minBalance = Witnet.Coins.fromWits(minBalance)
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

	const priceFeeds = await reloadRadonRequests(
		network,
		wallet.provider.network === "mainnet",
	);

	if (priceFeeds.length === 0) {
		console.error(
			`❌ Fatal: no price feeds to notarize${network ? ` on ${network.toUpperCase()}.` : "."}`,
		);
		process.exit(0);
	}
	const maxWidth = Math.max(
		...Object.keys(priceFeeds).map((caption) => caption.length),
	);
	Object.entries(priceFeeds).forEach(([caption, { conditions }]) => {
		lastUpdates[caption] = { value: 0, timestamp: 0 };
		console.info(
			`[${caption}${" ".repeat(maxWidth - caption.length)}] Update conditions: { deviation: ${conditions.deviationPercentage.toFixed(
				1,
			)} %, heartbeat: ${commas(conditions.heartbeatSecs)} " }`,
		);
		notarize(caption);
	});

	async function notarize(caption) {
		const { request, conditions } = priceFeeds[caption];
		const tag = `witnet:${wallet.provider.network}:${caption}${" ".repeat(maxWidth - caption.length)}`;
		try {
			let dryrun = JSON.parse(await request.execDryRun());
			if (!Object.keys(dryrun).includes("RadonInteger")) {
				throw `Error: unexpected dry run result: ${JSON.stringify(dryrun)}`;
			} else {
				dryrun = parseInt(dryrun.RadonInteger, 10);
			}

			// determine whether a new notarization is required
			const heartbeatSecs =
				Math.floor(Date.now() / 1000) - lastUpdates[caption].timestamp;
			if (heartbeatSecs < conditions.cooldownSecs) {
				const deviation =
					lastUpdates[caption].value > 0
						? (100 * (dryrun - lastUpdates[caption].value)) /
							lastUpdates[caption].value
						: 0;
				if (Math.abs(deviation) < conditions.deviationPercentage) {
					throw `${deviation >= 0 ? "+" : ""}${deviation.toFixed(2)} % deviation after ${heartbeatSecs} secs.`;
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
			let tx = await DRs.sendTransaction({
				fees: priority,
				witnesses: conditions.minWitnesses,
			});
			console.info(`[${tag}] RAD hash   =>`, tx.radHash);
			console.info(`[${tag}] DRT hash   =>`, tx.hash);
			console.info(`[${tag}] DRT weight =>`, commas(tx.weight));
			console.info(`[${tag}] DRT wtnsss =>`, tx.witnesses);
			console.debug(
				`[${tag}] DRT inputs =>`,
				tx.tx?.DataRequest?.signatures.length,
			);
			console.info(
				`[${tag}] DRT cost   =>`,
				Witnet.Coins.fromNanowits(
					tx.fees.nanowits + tx.value?.nanowits,
				).toString(2),
			);

			// await inclusion in Witnet
			tx = await DRs.confirmTransaction(tx.hash, {
				onStatusChange: () => console.info(`[${tag}] DRT status =>`, tx.status),
			}).catch((err) => {
				console.error(`[${tag}] ${err}`)
				// throw err;
				/* FORCE TERMINATION */ process.exit(0)
			});

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
						console.info(`[${tag}] DRT result =>`, lastUpdates[caption]);
					} else {
						throw `Unexpected DRT result => ${result}`;
					}
					break;
				}
				const delay = (ms) =>
					new Promise((_resolve) => setTimeout(_resolve, ms));
				await delay(5000);
			} while (status !== "solved");
		} catch (err) {
			console.warn(`[${tag}] ${err}`);
		}
		const elapsed =
			Math.floor(Date.now() / 1000) - lastUpdates[caption].timestamp;
		const remaining = conditions.cooldownSecs - elapsed;
		const timeout =
			remaining > 0 ? Math.min(remaining, DRY_RUN_POLLING_SECS) : 0;
		setTimeout(() => notarize(caption), timeout * 1000);
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
			/* FORCE TERMINATION */ process.exit(0)
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
		return balance;
	}

	async function reloadRadonRequests(network, mainnets) {
		const captions = [];
		const rulebook = configPath
			? await Rulebook.fromUrlBase(configPath)
			: Rulebook.default();
		const priceFeeds = rulebook.getNetworkPriceFeeds(network);
		return Object.fromEntries(
			priceFeeds.requests
				.map((caption) => {
					captions.push(caption);
					const artifact = utils.captionToWitOracleRequestPrice(caption);
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
				.filter(([caption], index) => captions.indexOf(caption) === index)
				.sort(([a], [b]) => a.localeCompare(b)),
		);
	}
}
