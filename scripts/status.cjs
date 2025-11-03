const { Witnet } = require("@witnet/sdk");

require("dotenv").config({ quiet: true });
const moment = require("moment");

const { utils, Rulebook } = require("../dist/src/lib");
const helpers = require("../src/bin/helpers.cjs");
const { colors } = helpers;

const assets = require("../dist/witnet/assets/index.cjs");

const witRpcUrl = helpers.spliceFromArgs(process.argv, `--witnet`);

main();

async function main() {
	const witnet = await Witnet.JsonRpcProvider.fromEnv(
		witRpcUrl === "testnet"
			? "https://rpc-testnet.witnet.io"
			: witRpcUrl === "mainnet"
				? "https://rpc-01.witnet.io"
				: witRpcUrl,
	);

	// Parse rulebook resources from witnet's workspace directory:
	const rulebook = Rulebook.workspace();
	const priceFeeds = rulebook.getNetworkPriceFeeds();

	helpers.traceHeader(
		`WITNET ${witnet.network.toUpperCase()}`,
		helpers.colors.lwhite,
	);

	const captions = [];
	const radHashes = require("../witnet/requests.json");
	const radEntries = Object.entries(radHashes);

	let { requests } = priceFeeds;

	// read all radon requests required to be polled
	requests = requests
		.map((caption) => {
			caption = caption.split("#")[0];
			captions.push(caption);
			const artifact = utils.captionToWitOracleRequestPrice(caption);
			let request;
			try {
				request = utils.requireRadonRequest(artifact, assets);
			} catch (err) {
				console.error(`Error: ${colors.mred(artifact)}: ${err}`);
			}
			const networks = rulebook.getPriceFeedNetworks(
				caption,
				witnet.network === "mainnet",
			);
			return [caption, artifact, request, networks];
		})
		.filter(
			([, , request, networks]) => request !== undefined && networks.length > 0,
		);

	// remove repeated records or those that are not required in any network
	requests = requests
		.filter(([caption], index) => captions.indexOf(caption) === index)
		.sort(([a], [b]) => a.localeCompare(b));
	// .filter(([,,, networks]) => networks.length > 0)

	// search latest data requests solving every Witnet-based price feed
	console.info(`> Dry-running ${requests.length} data requests ...`);
	const maintenance = { networks: [], requests: [] };
	requests = await Promise.all(
		requests.map(async ([caption, artifact, request, networks]) => {
			const [dataRequests, dryRunResult] = await Promise.all([
				witnet.searchDataRequests(request.radHash, {
					limit: 16,
					reverse: true,
				}),
				request
					.execDryRun(true)
					.catch((err) => console.error(`  ${caption}: Error: ${err}`)),
			]);

			const drt = dataRequests.find(
				(drt) => drt?.result?.finalized && drt.result.cbor_bytes,
			); // todo: check cbor_bytes is not tagged with error

			let dryRun;
			let failingSources = 0;
			try {
				const parsed = JSON.parse(dryRunResult);
				dryRun = parseInt(parsed?.tally?.result.RadonInteger, 10);
				parsed?.retrieve?.forEach((retrieval, index) => {
					if (!retrieval?.result || retrieval.result.RadonError) {
						const authority = request.sources[index].authority
							.split(".")
							.slice(-2)
							.join(".");
						console.info(
							`> ${colors.yellow(artifact)}: cannot retrieve data from ${colors.magenta(utils.camelize(authority))}`,
						);
						failingSources += 1;
					}
				});
			} catch {}

			if (failingSources >= request.sources.length / 2) {
				console.info(
					`> ${colors.mred(artifact)}: too many failing sources: ${failingSources} out of ${request.sources.length}`,
				);
				maintenance.requests.push(artifact);
			}

			const updateConditions = rulebook.getPriceFeedUpdateConditions(
				caption,
				witnet.network === "mainnet",
			);

			const uptodate = radEntries
				.filter(([network, deployed]) => {
					if (deployed[artifact] === request.radHash) return true;
					else if (
						deployed[artifact] &&
						deployed[artifact] !== request.radHash
					) {
						console.info(
							`> ${colors.yellow(artifact)}: request is outdated in ${colors.cyan(network)}`,
						);
						maintenance.networks.push(network);
					}
					return false;
				})
				.map(([network]) => network).length;

			networks.forEach((network) => {
				if (!radHashes[network] || !radHashes[network][artifact]) {
					console.info(
						`> ${colors.yellow(artifact)}: needs to be deployed in ${colors.cyan(network)}`,
					);
					maintenance.networks.push(network);
				}
			});

			return [
				caption,
				artifact,
				request,
				drt
					? {
							hash: drt?.hash,
							lastPrice: utils.cbor.decode(
								utils.fromHexString(drt.result.cbor_bytes),
							),
							timestamp: drt.result.timestamp,
						}
					: undefined,
				drt?.hash ? dryRun : undefined,
				{ ...updateConditions },
				{ total: networks.length, upToDate: uptodate },
				{ total: request.sources.length, failing: failingSources },
			];
		}),
	);
	console.info();

	if (requests.length > 0) {
		let deployed = 0;
		helpers.traceTable(
			requests.map(
				([
					caption,
					,
					request,
					drt,
					dryRun,
					conditions,
					networks,
					providers,
				]) => {
					const { radHash } = request;
					const deviation =
						drt?.lastPrice && dryRun
							? Number(
									(100 * (dryRun - drt.lastPrice)) / drt.lastPrice,
								).toFixed(3)
							: undefined;
					const sign = deviation >= 0 ? "+" : "-";
					deployed += networks.total;
					const now = Math.floor(Date.now() / 1000);
					return [
						caption,
						`${radHash.slice(0, 6)}..${radHash.slice(-5)}`,
						`± ${conditions?.deviationPercentage.toFixed(1)} %`,
						moment.duration(conditions?.heartbeatSecs, "seconds").humanize(),
						moment.duration(conditions?.cooldownSecs, "seconds").humanize(),
						networks.total !== networks.upToDate
							? `${colors.cyan(`${networks.upToDate} out of `)}${colors.mcyan(networks.total)}`
							: `${colors.mcyan(networks.total)}`,
						providers.failing > 0
							? `${colors.mmagenta(`${providers.total - providers.failing}`)} ${colors.magenta(`out of ${providers.total}`)}`
							: colors.mmagenta(providers.total),
						drt?.timestamp
							? moment.duration(now - drt?.timestamp, "seconds").asSeconds() >
								conditions?.heartbeatSecs
								? colors.mred(moment.unix(drt.timestamp).fromNow())
								: colors.yellow(moment.unix(drt.timestamp).fromNow())
							: "",
						deviation <= conditions?.deviationPercentage
							? colors.green(`${sign} ${Math.abs(deviation).toFixed(3)} %`)
							: Number.isNaN(deviation)
								? ""
								: colors.red(`${sign} ${Math.abs(deviation).toFixed(3)} %`),
					];
				},
			),
			{
				headlines: [
					":CAPTION",
					"RADON REQUEST",
					"threshold:",
					":heartbeat",
					":cooldown",
					"# networks",
					"# APIs",
					"LAST REQUEST:",
					"DEVIATION:",
				],
				colors: [
					colors.lwhite,
					colors.mgreen,
					colors.gray,
					colors.gray,
					colors.gray,
				],
			},
		);
		console.info(
			`^ Listed ${requests.length} distinct price feeds deployed ${deployed} times through out ${
				utils
					.getEvmNetworks()
					.filter(
						(network) =>
							!(
								(witnet.network === "mainnet") !==
								utils.isEvmNetworkMainnet(network)
							),
					).length
			} different EVM ${
				witnet.network === "mainnet" ? "mainnets" : "testnets"
			}.`,
		);
	}
	if (maintenance.networks.length > 0) {
		console.info(
			`\n> The following ${witnet.network === "mainnet" ? "mainnets" : "testnets"} require maintenance:`,
		);
		new Set(maintenance.networks.sort()).forEach((network) =>
			console.info(`  ${colors.cyan(network)}`),
		);
	}
	if (maintenance.requests.length > 0) {
		console.info(`\n> The following requests require maintenance:`);
		new Set(maintenance.requests.sort()).forEach((network) =>
			console.info(`  ${colors.green(network)}`),
		);
	}
}
