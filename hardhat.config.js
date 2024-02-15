require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-web3-v4");

const { settings, utils } = require("witnet-solidity-bridge")
const [, target ] = utils.getRealmNetworkFromString();

task("pfs:deploy", "Upgrade price feeds")
  .addOptionalParam("artifacts", "Optional list of price artifacts to revisit.")
  .setAction(async (taskArgs) => {
    const deploy = require("./scripts/hardhat/pfs-deploy");
    await deploy.run(taskArgs).catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
  }
);

task("pfs:status", "List currently supported price feeds.")
  .setAction(async (taskArgs) => {
    const script = require("./scripts/hardhat/pfs-status");
    await script.run(taskArgs).catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
  }
);

task("pfs:routes", "List currently routed price feeds.")
  .setAction(async (taskArgs) => {
    const script = require("./scripts/hardhat/pfs-routes");
    await script.run(taskArgs).catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
  }
);

task("pfs:sla", "Get default Witnet SLA")
  .addOptionalParam("committeeSize", "Minimum number of witnesses required for every price update.")
  .addOptionalParam("collateralFee", "Minimum collateral in $nanoWIT required for witnessing nodes.")
  .setAction(async (taskArgs) => {
    const script = require("./scripts/hardhat/pfs-sla");
    await script.run(taskArgs).catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
  }
);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: Object.fromEntries(Object.entries(settings.getNetworks())
    .map(([network, config]) => {
      return [network, {
        chainId: config.network_id,
        gas: config?.gas || "auto",
        gasPrice: config?.gasPrice || "auto",
        url: `http://${config?.host || "localhost"}:${config?.port || 8545}`
      }]
    })
  ),
  solidity: settings.getCompilers(target),
  sourcify: {
    enabled: true,
    apiUrl: "https://sourcify.dev/server",
    browserUrl: "https://repo.sourcify.dev",
  },
  etherscan: {
    apiKey: Object.fromEntries(
        Object.entries(settings.getNetworks())
            .filter(([,config]) => config?.verify)
            .map(([network, config]) => {
                const [ecosystem,] = utils.getRealmNetworkFromString(network)
                return [network, config?.verify?.apiKey ?? `ETHERSCAN_${ecosystem.toUpperCase()}_API_KEY`]
            }),
    ),      
    customChains: Object.entries(settings.getNetworks())
        .filter(([,config]) => config?.verify)
        .map(([network, config]) => {
            return {
                network,
                chainId: config.network_id,
                urls: {
                    apiURL: config?.apiUrl,
                    browserURL: config?.browserUrl
                }
            }
        }),
  }
};
