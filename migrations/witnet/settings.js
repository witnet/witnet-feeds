const { merge } = require("lodash")
module.exports = {
  compilers: merge(
    require("witnet-solidity-bridge/migrations/witnet.settings").compilers, {
    },
  ),
  networks: merge(
    require("witnet-solidity-bridge/migrations/witnet.settings").networks, {
      default: {
        "ethereum.mainnet": {
          skipDryRun: true,
          confirmations: 2,
        },
      },
      polygon: {
        "polygon.goerli": {
          confirmations: 2,
        },
        "polygon.mainnet": {
          confirmations: 2,
        },
      },
    },
  ),
}
