const { Witnet } = require("@witnet/sdk");
const {
	ethers,
	WitOracle,
	PriceFeedOracles,
	PriceFeedMappers,
} = require("@witnet/solidity");

const { execSync } = require("node:child_process");
require("dotenv").config({ quiet: true });
const inquirer = require("inquirer");
const moment = require("moment");

const { assets, utils, Rulebook } = require("../dist/src/lib");
const radHashes = require("../witnet/requests.json");
const helpers = require("../src/bin/helpers.cjs");
const { colors } = helpers;

const host =
	helpers.spliceFromArgs(process.argv, `--host`) || "http://127.0.0.1";
const port = helpers.parseIntFromArgs(process.argv, `--port`) || 8545;
const signer = helpers.spliceFromArgs(process.argv, `--signer`);
const witRpcUrl = helpers.spliceFromArgs(process.argv, `--witnet`);

let network = helpers.spliceFromArgs(process.argv, `--network`);
let target = helpers.spliceFromArgs(process.argv, `--target`);

const clone = process.argv.indexOf(`--clone`) >= 0;

main();

async function main() {
	const witnet = await Witnet.JsonRpcProvider.fromEnv(
		witRpcUrl === "testnet"
			? "https://rpc-testnet.witnet.io"
			: witRpcUrl === "mainnet"
				? "https://rpc-01.witnet.io"
				: witRpcUrl,
	);

	const witOracle = await WitOracle.fromJsonRpcUrl(`${host}:${port}`, signer);
	if (network && witOracle.network !== network.toLowerCase()) {
		console.error(
			`Error: gateway at ${host}:${port} connects to a different network (${witOracle.network})`,
		);
		process.exit(1);
	}

	network = witOracle.network;
	if (utils.isEvmNetworkMainnet(network) !== (witnet.network === "mainnet")) {
		console.error(
			`Error: cannot connect to the Witnet ${witnet.network} and an EVM ${witnet.network === "mainnet" ? "testnet" : "mainnet"} at the same time.`,
		);
		process.exit(1);
	}

	helpers.traceHeader(`${network.toUpperCase()}`, helpers.colors.lcyan);
	if (!radHashes[network]) radHashes[network] = {};

	const { provider } = witOracle;
	const framework = await helpers.prompter(
		utils.fetchWitOracleFramework(provider),
	);
	if (!target) {
		if (!framework.WitPriceFeeds) {
			console.info(`Network ${network} supports no V3 price feeds.`);
			process.exit(0);
		} else {
			target = framework.WitPriceFeeds.address;
		}
	}

	const wrapper = await witOracle.getWitPriceFeedsAt(target);
	let curator = await wrapper.getEvmCurator();
	const [artifact, version, consumer, master] = await Promise.all([
		await wrapper.getEvmImplClass(),
		await wrapper.getEvmImplVersion(),
		await wrapper.getEvmConsumer(),
		await wrapper.getEvmClonableBase(),
	]);

	if (!artifact.startsWith("WitPriceFeeds")) {
		console.error(`Error: unsupported ${artifact} at ${target}`);
		process.exit(1);
	}
	console.info(
		`> ${helpers.colors.lwhite(artifact)}: ${helpers.colors.mblue(
			target,
		)} ${helpers.colors.blue(`[ ${version} ]`)}`,
	);
	if (master !== "0x0000000000000000000000000000000000000000") {
		console.info(`> Master address:   ${colors.blue(master)}`);
	}
	if (clone) {
		console.info();
		await inquirer
			.prompt([
				{
					name: "setDefault",
					type: "confirm",
					message: "Do you want the new clone to become your default address?",
					default: true,
				},
				{
					name: "curator",
					type: "list",
					message: "Please, select a new curator address:",
					choices: (await provider.listAccounts()).map(
						(signer) => signer.address,
					),
				},
			])
			.then(async (answer) => {
				console.info(
					colors.lblue(`\n  >>> CLONING THE WIT PRICE FEEDS CONTRACT <<<`),
				);
				console.info(`  > Master address:    ${colors.blue(wrapper.address)}`);
				if (answer.curator === wrapper.signer.address) {
					console.info(
						`  > Curator address:   ${colors.mmagenta(answer.curator)}`,
					);
				} else {
					console.info(
						`  > Signer address:    ${colors.yellow(wrapper.signer.address)}`,
					);
					console.info(
						`  > Curator address:   ${colors.magenta(answer.curator)}`,
					);
				}
				const { logs } = await _invokeAdminTask(
					wrapper.clone.bind(wrapper),
					answer.curator,
				);
				if (logs?.[0]?.topics[3]) {
					const cloned = `0x${logs[0].topics[3].slice(-40)}`;
					console.info(`  > Cloned address:    ${colors.mblue(cloned)}`);
					wrapper.attach(cloned);
					if (answer.setDefault) {
						const { addresses } = helpers.readWitnetJsonFiles("addresses");
						if (!addresses[network]) addresses[network] = {};
						if (!addresses[network].apps) addresses[network].apps = {};
						addresses[network].apps.WitPriceFeeds = cloned;
						helpers.saveWitnetJsonFiles({ addresses });
					}
				} else {
					console.error(colors.mred(`  Error: no Cloned event was emitted.`));
					process.exit(1);
				}
				curator = answer.curator;
			});
	} else {
		if (consumer !== "0x0000000000000000000000000000000000000000") {
			console.info(`> Consumer address: ${colors.cyan(consumer)}`);
		}
		if (wrapper.signer.address !== curator) {
			console.info(`> Curator address:  ${colors.magenta(curator)}`);
			console.info(
				`> Signer address:   ${colors.yellow(wrapper.signer.address)}`,
			);
		} else {
			console.info(`> Curator address:  ${colors.mmagenta(curator)}`);
		}
	}
	console.info();

	// Parse rulebook resources from witnet's workspace directory:
	const rulebook = Rulebook.workspace();
	const networkPriceFeeds = rulebook.getNetworkPriceFeeds(network);

	// panic if repeated captions are found
	Object.keys(networkPriceFeeds.requests).forEach((caption) => {
		if (
			Object.keys(networkPriceFeeds.requests).filter((key) => key === caption)
				.length > 1
		) {
			console.error(
				`  ${colors.mred(caption)} is declared multiple times as a Witnet-solved price feed.`,
			);
			console.error(
				`  Please, revisit ${helpers.colors.gray("./witnet.priceFeeds.json")}.`,
			);
			process.exit(1);
		}
	});

	Object.entries(networkPriceFeeds.oracles).forEach(([caption, specs]) => {
		if (networkPriceFeeds.requests.indexOf(caption) >= 0) {
			console.error(
				`  ${colors.mred(caption)} is declared as being both a Witnet and an ${helpers.camelize(specs.class)} price feed.`,
			);
			console.error(
				`  Please, revisit ${helpers.colors.gray("./witnet.priceFeeds.json")}.`,
			);
			process.exit(1);
		} else if (
			Object.keys(networkPriceFeeds.oracles).filter((key) => key === caption)
				.length > 1
		) {
			console.error(
				`  ${colors.mred(caption)} is declared multiple times as an oraclized price feed.`,
			);
			console.error(
				`  Please, revisit ${helpers.colors.gray("./witnet.priceFeeds.json")}.`,
			);
			process.exit(1);
		}
	});

	Object.entries(networkPriceFeeds.mappers).forEach(([caption, specs]) => {
		if (networkPriceFeeds.requests.indexOf(caption) >= 0) {
			console.error(
				`  ${colors.mred(caption)} is declared as being both a Witnet and a mapped:${helpers.camelize(specs.class)} price feed.`,
			);
			console.error(
				`  Please, revisit ${helpers.colors.gray("./witnet.priceFeeds.json")}.`,
			);
			process.exit(1);
		} else if (Object.keys(networkPriceFeeds.oracles).indexOf(caption) >= 0) {
			console.error(
				`  ${colors.mred(caption)} is declared as being both an oraclized and a mapped:${helpers.camelize(specs.class)} price feed.`,
			);
			console.error(
				`  Please, revisit ${helpers.colors.gray("./witnet.priceFeeds.json")}.`,
			);
			process.exit(1);
		} else if (
			Object.keys(networkPriceFeeds.mappers).filter((key) => key === caption)
				.length > 1
		) {
			console.error(
				`  ${colors.mred(caption)} is declared multiple times as a mapped price feed.`,
			);
			console.error(
				`  Please, revisit ${helpers.colors.gray("./witnet.priceFeeds.json")}.`,
			);
			process.exit(1);
		}
	});

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/// MAIN LOOP : introspection of to-do tasks requires all price feed that require attention to be removed first,
	//              and then be re-settled again.

	const settled = { requests: [], oracles: [], mappers: [] };
	const tasks = {
		requests: [],
		mappers: [],
		oracles: [],
		conditions: [],
		removals: [],
		verifications: [],
	};

	for (let runs = 1; runs >= 0; runs--) {
		tasks.removals = [];

		// Fetch price feeds currently settled on-chain:
		const onchainPriceFeeds = await wrapper.lookupPriceFeeds();

		// ================================================================================================================
		// --- Checkout Witnet requests -----------------------------------------------------------------------------------

		// load specs of Witnet-solved price feeds
		settled.requests = networkPriceFeeds.requests.map((caption) => {
			const target = utils.captionToWitOracleRequestPrice(caption);
			const sources = utils.requireRadonRequest(target, assets);
			return [
				caption,
				{
					class: "oracle:witnet",
					sources,
					target,
					conditions: rulebook.getPriceFeedUpdateConditions(caption, network),
				},
			];
		});

		// settle on-chain price feeds based on Witnet Radon requests
		tasks.requests = settled.requests
			.filter(([caption, obj]) => {
				const found = onchainPriceFeeds.find((pf) => pf.symbol === caption);
				if (
					found &&
					(!found.oracle ||
						found.oracle.class.toLowerCase() !== "witnet" ||
						found.oracle.sources !== `0x${obj.sources.radHash}`)
				) {
					tasks.removals.push(caption);
					console.info(`  ${colors.yellow(caption)} has new sources.`);
					return true;
				} else if (!found) {
					if (!runs)
						console.info(`  ${colors.green(caption)} needs to be settled.`);
				}
				return !found;
			})
			.map(([caption, obj]) => ({
				caption,
				decimals: parseInt(caption.split("#")[0].split("-").pop(), 10) || 0,
				radHash: `0x${obj.sources.radHash}`,
			}));

		delete tasks.verifications;
		tasks.verifications = settled.requests
			.filter(([caption, obj]) => {
				if (obj.sources.radHash !== radHashes[network][obj.target]) {
					if (!runs)
						console.info(
							`  ${colors.yellow(caption)} requires data sources to be verified.`,
						);
					return true;
				} else {
					return false;
				}
			})
			.map(([, obj]) => obj.target);

		// ================================================================================================================
		// --- Checkout third-party price feeds ---------------------------------------------------------------------------

		// load specs of oraclized price feeds
		settled.oracles = Object.entries(networkPriceFeeds.oracles).map(
			([caption, oracle]) => [
				caption,
				{
					class: `oracle:${oracle.class}`,
					sources: oracle.sources,
					target: oracle.target,
					conditions: rulebook.getPriceFeedUpdateConditions(caption, network),
				},
			],
		);

		// settle oraclized price feeds that have not yet been settled or otherwise settled with different parameters
		tasks.oracles = settled.oracles
			.filter(([caption, obj]) => {
				const found = onchainPriceFeeds.find((pf) => pf.symbol === caption);
				const supported = Object.values(PriceFeedOracles).includes(
					helpers.camelize(obj.class.split(":").pop().toLowerCase()),
				);
				if (!supported) {
					console.info(
						`  ${colors.red(caption)} requires some unsupported "${obj.class}".`,
					);
					process.exit(1);
				} else if (
					found &&
					(!found.oracle ||
						found.oracle.class.toLowerCase() !==
							obj.class.split(":").pop().toLowerCase() ||
						found.oracle.target !== obj.target ||
						found.oracle.sources !==
							(obj.sources ||
								"0x0000000000000000000000000000000000000000000000000000000000000000"))
				) {
					tasks.removals.push(caption);
					console.info(`  ${colors.yellow(caption)} has new parameters.`);
					// console.log(found.oracle.sources, obj.sources)
					// console.log(found.oracle.target, obj.target)
					return true;
				} else if (!found) {
					if (!runs)
						console.info(`  ${colors.green(caption)} needs to be settled.`);
				}
				return !found;
			})
			.map(([caption, obj]) => {
				return {
					caption,
					decimals: parseInt(caption.split("#")[0].split("-").pop(), 10) || 0,
					oracle: helpers.camelize(obj.class.split(":").pop().toLowerCase()),
					target: obj.target,
					sources: obj.sources,
				};
			});

		// ================================================================================================================
		// --- Checkout price feeds mappings ------------------------------------------------------------------------------

		// load specs of mapped price feeds
		settled.mappers = Object.entries(networkPriceFeeds.mappers).map(
			([caption, mapper]) => [
				caption,
				{
					class: `mapper:${mapper.class}`,
					sources: mapper.deps,
					conditions: rulebook.getPriceFeedUpdateConditions(caption, network),
				},
			],
		);

		// respect the order of precedence ...
		settled.mappers = settled.mappers.sort(([caption], [, { sources }]) => {
			const a_index = settled.mappers.indexOf(caption);
			sources.forEach((source) => {
				if (settled.mappers.indexOf(source) < a_index) {
					return 1;
				}
			});
			return -1;
		});

		// settle mapped price feeds that have not yet been settled or otherwise settled with different parameters
		for (let iters = 0; iters < 16; iters++) {
			tasks.mappers = settled.mappers
				.filter(([caption, obj]) => {
					const found = onchainPriceFeeds.find((pf) => pf.symbol === caption);
					const supported = Object.values(PriceFeedMappers).includes(
						helpers.camelize(obj.class.split(":").pop().toLowerCase()),
					);
					if (!supported) {
						console.info(
							`  ${colors.red(caption)} requires unsupported "${obj.class}".`,
						);
						process.exit(1);
					}
					if (
						found &&
						(!found.mapper ||
							found.mapper.class.toLowerCase() !==
								obj.class.split(":").pop().toLowerCase() ||
							found.mapper.deps.some(
								(caption) => !obj.sources.includes(caption),
							) ||
							obj.sources.some(
								(caption) => !found.mapper.deps.includes(caption),
							))
					) {
						if (!tasks.removals.includes(caption)) {
							tasks.removals.push(caption);
						}
						if (!tasks.mappers.find((mapper) => mapper.caption === caption)) {
							console.info(`  ${colors.yellow(caption)} has new dependencies.`);
						}
						return true;
					}
					if (!found) {
						if (!tasks.mappers.find((mapper) => mapper.caption === caption)) {
							console.info(`  ${colors.green(caption)} needs to be settled.`);
						}
						return true;
					} else if (
						obj.sources.some((dependency) =>
							tasks.removals.includes(dependency),
						)
					) {
						if (!tasks.mappers.find((mapper) => mapper.caption === caption)) {
							console.info(
								`  ${colors.green(caption)} has updated dependencies.`,
							);
						}
						return true;
					} else {
						return false;
					}
				})
				.map(([caption, obj]) => {
					return {
						caption,
						decimals: parseInt(caption.split("#")[0].split("-").pop(), 10) || 0,
						mapper: helpers.camelize(obj.class.split(":").pop().toLowerCase()),
						deps: obj.sources,
					};
				});
		}

		// ================================================================================================================
		// --- Checkout price feeds to be decommissioned ------------------------------------------------------------------

		onchainPriceFeeds.forEach((pf) => {
			if (
				!settled.requests.find(([caption]) => caption === pf.symbol) &&
				!settled.oracles.find(([caption]) => caption === pf.symbol) &&
				!settled.mappers.find(([caption]) => caption === pf.symbol)
			) {
				tasks.removals.push(pf.symbol);
				console.info(`  ${colors.red(pf.symbol)} is required no more.`);
			}
		});

		// ================================================================================================================
		// --- PERFORM TO-DO TASKS ----------------------------------------------------------------------------------------

		// only if the provider is connected to the proper price feeds curator address:
		if (wrapper.signer.address === curator) {
			if (runs > 0) {
				// on all main iterations but the last:
				if (tasks.removals.length > 0) {
					console.info(
						colors.lyellow(`\n  >>> REMOVE AFFECTED PRICE FEEDS <<<`),
					);
					for (const caption of tasks.removals) {
						console.info(
							`\n  ${colors.lwhite(caption)}${" ".repeat(18 - caption.length)}`,
						);
						await _invokeAdminTask(
							wrapper.removePriceFeed.bind(wrapper),
							caption,
						);
					}
					console.info();
				}
			}
		}
	}
	/// END OF MAIN LOOP
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	if (
		wrapper.signer.address !== curator &&
		(tasks.removals.length > 0 ||
			tasks.requests.length > 0 ||
			tasks.oracles.length > 0 ||
			tasks.mappers.length > 0)
	) {
		console.error(colors.red(`\n^ Pending tasks require curatorship!`));
		process.exit(1);
	} else if (wrapper.signer.address === curator) {
		if (tasks.verifications.length > 0) {
			console.info(
				colors.lyellow(`\n\n  >>> VERIFY RADON REQUESTS ON-CHAIN <<<`),
			);
			execSync(
				`npx witeth assets ${tasks.verifications.join(" ")} --deploy --force --port ${port}`,
				{ stdio: "inherit", stdout: "inherit" },
			);
		}
		if (tasks.requests.length > 0) {
			console.info(colors.lyellow(`\n  >>> SETTLE WITNET PRICE FEEDS <<<`));
			for (const task of tasks.requests) {
				console.info(
					`\n  ${colors.lwhite(task.caption)}: ${" ".repeat(18 - task.caption.length)} ${colors.yellow(task.radHash)}`,
				);
				await _invokeAdminTask(
					wrapper.settlePriceFeedRadonHash.bind(wrapper),
					task.caption,
					-task.decimals,
					task.radHash,
				);
			}
			console.info();
		}
		if (tasks.oracles.length > 0) {
			console.info(colors.lyellow(`\n  >>> SETTLE ORACLIZED PRICE FEEDS <<<`));
			for (const task of tasks.oracles) {
				console.info(
					`\n  ${colors.lwhite(task.caption)}: ${" ".repeat(18 - task.caption.length)} ${colors.yellow(`${task.oracle}:${task.sources || task.target}`)}`,
				);
				await _invokeAdminTask(
					wrapper.settlePriceFeedOracle.bind(wrapper),
					task.caption,
					-task.decimals,
					task.oracle,
					task.target,
					task.sources,
				);
			}
			console.info();
		}
		if (tasks.mappers.length > 0) {
			console.info(colors.lyellow(`\n  >>> SETTLE MAPPED PRICE FEEDS <<<`));

			for (const task of tasks.mappers) {
				console.info(
					`\n  ${colors.lwhite(task.caption)}: ${" ".repeat(18 - task.caption.length)} ${colors.yellow(
						`${task.mapper}(${JSON.stringify(task.deps)})`,
					)}`,
				);
				await _invokeAdminTask(
					wrapper.settlePriceFeedMapper.bind(wrapper),
					task.caption,
					-task.decimals,
					task.mapper,
					task.deps,
				);
			}
			console.info();
		}
	}

	// re-read on-chain price feeds, after all affected price feeds have been previously settled
	const onchainPriceFeeds = await wrapper.lookupPriceFeeds();
	tasks.conditions.push(
		...[...settled.requests, ...settled.oracles]
			.filter(([caption, obj]) => {
				const found = onchainPriceFeeds.find(
					({ symbol }) => symbol === caption,
				);
				const differs =
					found?.updateConditions &&
					obj.conditions &&
					_checkIfConditionsDiffer(found.updateConditions, obj.conditions);
				if (!found || differs) {
					// console.info(`  ${colors.yellow(caption)} requires conditions to be altered. `)
					return true;
				} else {
					return false;
				}
			})
			.map(([caption, obj]) => ({
				caption,
				conditions: obj.conditions,
			})),
	);

	if (tasks.conditions.length > 0) {
		if (wrapper.signer.address === curator) {
			console.info(colors.lyellow(`\n  >>> SETTLE UPDATE CONDITIONS <<<`));
			for (const task of tasks.conditions) {
				console.info(
					`\n  ${colors.lwhite(task.caption)}: ${" ".repeat(18 - task.caption)} ${colors.yellow(JSON.stringify(task.conditions))}`,
				);
				await _invokeAdminTask(
					wrapper.settlePriceFeedUpdateConditions.bind(wrapper),
					task.caption,
					task.conditions,
				);
			}
			console.info();
		} else {
			console.error(
				colors.red(`\n^ Updating price feeds conditions require curatorship!`),
			);
			process.exit(1);
		}
	}

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/// OUTPUT SETTLED PRICE FEEDS AFTER CURATION

	if (settled.requests.length > 0) {
		console.info(
			colors.lyellow(`\n  >>> DRY-RUNNING WITNET RADON REQUESTS <<<\n`),
		);
		settled.requests = await Promise.all(
			settled.requests.map(async ([caption, obj]) => {
				let dryrun;
				try {
					dryrun = JSON.parse(await obj.sources.execDryRun(true));
					const result = dryrun.tally.result;
					console.info(
						`  ${colors.green(caption)}${" ".repeat(18 - caption.length)} => ${
							result?.RadonInteger
								? colors.cyan(JSON.parse(result.RadonInteger))
								: colors.red(JSON.stringify(result))
						}`,
					);
				} catch (err) {
					console.error(
						`  ${colors.lwhite(caption)}${" ".repeat(
							18 - caption.length,
						)} => ${colors.red("FAILED")}`,
					);
					console.log(err);
				}
				return [
					caption,
					{
						...obj,
						dryrun,
					},
				];
			}),
		);
		console.info();
	}

	const priceFeeds = [
		...settled.requests,
		...settled.oracles,
		...settled.mappers,
	]
		.sort((a, b) => a[0].localeCompare(b[0]))
		.map(([caption, obj]) => {
			const found = onchainPriceFeeds.find((pf) => pf.symbol === caption);
			const id4 = found?.id4;
			const target = found?.oracle?.target;
			let sources;
			if (obj.class.endsWith(":witnet")) {
				sources = obj.sources.sources
					.map((source, index) => {
						const result = obj?.dryrun?.retrieve[index]?.result;
						const color = result
							? result.RadonError
								? colors.mred
								: colors.mmagenta
							: colors.magenta;
						return color(
							source.authority.split(".").slice(-2)[0].toLowerCase(),
						);
					})
					.sort((a, b) =>
						helpers.colorstrip(a).localeCompare(helpers.colorstrip(b)),
					)
					.join(" ");
			} else if (obj.class.startsWith("mapper")) {
				sources = obj.sources
					.map((caption) => colors.gray(caption.split(".").pop().toLowerCase())) //caption.split("-").slice(-2)[0].split(".").pop().toLowerCase())
					.join(" ");
			} else {
				sources = colors.mblue(
					found?.oracle?.sources !==
						"0x0000000000000000000000000000000000000000000000000000000000000000"
						? `${found.oracle.target}:${found.oracle.sources.slice(2, 10)}`
						: found.oracle.target,
				);
			}
			return [caption, { ...obj, id4, target, sources }];
		})
		.filter(([, obj]) => obj.id4);

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
				obj.class === "oracle:witnet"
					? `± ${obj.conditions.deviationPercentage.toFixed(1)} %`
					: "",
			];
		}),
		{
			headlines: [
				":ID4",
				":CAPTION",
				":solver",
				":sources",
				"max.dev.:",
				":liveness",
				":promptness",
				"thrshold:",
			],
			colors: [
				colors.lwhite,
				colors.mgreen,
				colors.green,
				undefined,
				colors.gray,
				colors.gray,
				colors.gray,
				colors.magenta,
			],
		},
	);
}

function _checkIfConditionsDiffer(onchain, specs) {
	return (
		Number(onchain.callbackGas) !== specs?.callbackGas ||
		onchain.computeEMA !== specs?.computeEMA ||
		Number(onchain.cooldownSecs) !== specs?.cooldownSecs ||
		Number(onchain.heartbeatSecs) !== specs?.heartbeatSecs ||
		Number(onchain.maxDeviationPercentage) !== specs?.maxDeviationPercentage ||
		Number(onchain.minWitnesses) !== specs?.minWitnesses
	);
}

async function _invokeAdminTask(func, ...params) {
	const receipt = await func(...params, {
		evmConfirmations:
			helpers.parseIntFromArgs(process.argv, `--confirmations`) || 2,
		onTransaction: (txHash) => {
			process.stdout.write(
				`  - EVM transaction:   ${helpers.colors.gray(txHash)} ... `,
			);
		},
		onTransactionReceipt: () => {
			process.stdout.write(`${helpers.colors.lwhite("OK")}\n`);
		},
	}).catch((err) => {
		process.stdout.write(`${helpers.colors.mred("FAIL:\n")}`);
		console.error(err);
		process.exit(1);
	});
	if (receipt) {
		console.info(
			`  - EVM block number:  ${helpers.colors.lwhite(helpers.commas(receipt?.blockNumber))}`,
		);
		console.info(
			`  - EVM tx gas price:  ${helpers.colors.lwhite(ethers.formatUnits(receipt?.gasPrice, 9))} gweis`,
		);
		console.info(
			`  - EVM tx fee:        ${helpers.colors.lwhite(ethers.formatEther(receipt.fee))} ETH`,
		);
		const value = (await receipt.getTransaction()).value;
		console.info(
			`  - EVM effective gas: ${helpers.commas(Math.floor(Number((receipt.fee + value) / receipt.gasPrice)))} gas units`,
		);
	}
	return receipt;
}
