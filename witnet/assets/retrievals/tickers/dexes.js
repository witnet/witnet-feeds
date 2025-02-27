const { utils, Witnet } = require("witnet-solidity")
const { legacy } = require("witnet-solidity/assets")

const defaultQuery = { 
    query: `{ pair (id: "\\0\\") { token\\1\\Price } }` 
};
const defaultScript = { 
    script: Witnet.RadonScript(Witnet.RadonString)
        .parseJSONMap()
        .getMap("data")
        .getMap("pair")
        .getFloat("token\\1\\Price")
        .multiply(1e6)
        .round(),
};

module.exports = {
    "ticker/beamswap": Witnet.RadonRetrievals.GraphQLQuery({
        url: "https://graph.beamswap.io/subgraphs/name/beamswap/beamswap-amm-v2",
        ...defaultQuery,
        ...defaultScript,
    }),
    "ticker/kuswap": Witnet.RadonRetrievals.GraphQLQuery({
        url: "https://info.kuswap.finance/subgraphs/name/kuswap/swap",
        ...defaultQuery,
        ...defaultScript,
    }),
    "ticker/mojitoswap": Witnet.RadonRetrievals.GraphQLQuery({
        url: "https://thegraph.kcc.network/subgraphs/name/mojito/swap",
        ...defaultQuery,
        ...defaultScript,
    }),
    "ticker/mojitoswap#9": Witnet.RadonRetrievals.GraphQLQuery({
        url: "https://thegraph.kcc.network/subgraphs/name/mojito/swap",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("data").getMap("pair").getFloat("token\\1\\Price").multiply(1e9).round(),
        ...defaultQuery,
    }),
    "ticker/oolongswap": Witnet.RadonRetrievals.GraphQLQuery({
        url: "https://api.thegraph.com/subgraphs/name/oolongswap/oolongswap-mainnet",
        query: `{ pairs ( where: { token0: "\\0\\", token1: "\\1\\" }) { token1Price } }`,
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("data").getArray("pairs").getMap(0).getFloat("token1Price").multiply(1e6).round(),
    }),
    "ticker/pancake#v2": Witnet.RadonRetrievals.GraphQLQuery({
        url: "https://open-platform.nodereal.io/6eed3770d9874b5ca666625eb0628e9a/pancakeswap-free/graphql",
        ...defaultQuery,
        ...defaultScript,
    }),
    "ticker/quickswap#v3": Witnet.RadonRetrievals.GraphQLQuery({
        url: "https://api-next.thegraph.com/subgraphs/name/sameepsi/quickswap-v3",
        query: `{ pool (id: "\\0\\") { token\\1\\Price } }`,
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("data").getMap("pool").getFloat("token\\1\\Price").multiply(1e6).round(),
    }),
    "ticker/quickswap#v3#9": Witnet.RadonRetrievals.GraphQLQuery({
        url: "https://api-next.thegraph.com/subgraphs/name/sameepsi/quickswap-v3",
        query: `{ pool (id: "\\0\\") { token\\1\\Price } }`,
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("data").getMap("pool").getFloat("token\\1\\Price").multiply(1e9).round(),
    }),
    "ticker/stellaswap": Witnet.RadonRetrievals.GraphQLQuery({
        url: "https://analytics.stellaswap.com/api/graphql/stella-swap",
        ...defaultQuery,
        ...defaultScript,
    }),
    "ticker/sushiswap": Witnet.RadonRetrievals.GraphQLQuery({
        url: "https://api.thegraph.com/subgraphs/name/sushiswap/matic-exchange",
        ...defaultQuery,
        ...defaultScript
    }),
    "ticker/ubeswap": Witnet.RadonRetrievals.GraphQLQuery({
        url: "https://api.thegraph.com/subgraphs/name/ubeswap/ubeswap",
        query: `
            query PairsCurrent { 
                pairs (first: 100, orderBy: reserveUSD, orderDirection: desc, subgraphError: allow) {
                    id token\\1\\Price 
                } 
            }`,
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("data").getArray("pairs").filter(
                Witnet.RadonScript(Witnet.RadonMap).getString("id").match(
                    Witnet.RadonBoolean,
                    { "\\0\\": true },
                    false
                )
            ).getMap(0).getFloat("token\\1\\Price").multiply(1e6).round(),
    }),
    "ticker/uniswap#celo": Witnet.RadonRetrievals.GraphQLQuery({
        url: "https://api.thegraph.com/subgraphs/name/jesse-sawa/uniswap-celo",
        query: `{ pool (id: "\\0\\") { token\\1\\Price } }`,
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("data").getMap("pool").getFloat("token\\1\\Price").multiply(1e6).round(),
    }),
    "ticker/uniswap#v3": Witnet.RadonRetrievals.GraphQLQuery({
        url: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
        query: `{ pool (id: "\\0\\") { token\\1\\Price } }`,
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("data").getMap("pool").getFloat("token\\1\\Price").multiply(1e6).round(),
    }),    
}
