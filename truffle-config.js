const Witnet = require("witnet-utils")
const { merge } = require("lodash")
const settings = require("./migrations/witnet/settings")

const rn = Witnet.Utils.getRealmNetworkFromArgs()
const realm = rn[0]; const network = rn[1]
if (!settings.networks[realm] || !settings.networks[realm][network]) {
  if (network !== "develop" && network !== "test" && network !== "development") {
    console.error(
      `Fatal: network "${realm}:${network}"`,
      "configuration not found in \"./migrations/settings.js#networks\""
    )
    process.exit(1)
  }
}
console.info(`
Targetting "${realm.toUpperCase()}" ecosystem
=======================${"=".repeat(realm.length)}`)

module.exports = {
  build_directory: `./build/`,
  contracts_directory: "./contracts/",
  migrations_directory: "./migrations/truffle/",
  networks: settings.networks[realm],
  compilers: merge(
    settings.compilers.default,
    settings.compilers[realm]
  ),
  mocha: {
    reporter: "eth-gas-reporter",
    reporterOptions: {
      coinmarketcap: process.env.COINMARKETCAP_API_KEY,
      currency: "USD",
      gasPrice: 100,
      excludeContracts: ["Migrations"],
      src: "contracts",
    },
    timeout: 100000,
    useColors: true,
  },
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    elastos: process.env.ELASTOS_API_KEY,
    etherscan: process.env.ETHERSCAN_API_KEY,
    moonscan: process.env.MOONSCAN_API_KEY,
    polygonscan: process.env.POLYGONSCAN_API_KEY,
  },
}
