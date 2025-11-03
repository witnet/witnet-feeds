const { Witnet } = require("@witnet/sdk");
const { RadonScript, retrievals, types } = Witnet.Radon;
const { RadonBoolean, RadonMap, RadonString } = types;

const defaultQuery = {
	query: `{ pair (id: "\\0\\") { token\\1\\Price } }`,
};
const defaultScript = {
	script: RadonScript(RadonString)
		.parseJSONMap()
		.getMap("data")
		.getMap("pair")
		.getFloat("token\\1\\Price")
		.multiply(1e6)
		.round(),
};

module.exports = {
	"ticker/beamswap": retrievals.GraphQLQuery({
		url: "https://graph.beamswap.io/subgraphs/name/beamswap/beamswap-amm-v2",
		...defaultQuery,
		...defaultScript,
		samples: {
			"glint/usdc": ["0x61b4cec9925b1397b64dece8f898047eed0f7a07", "0"],
		},
	}),
	// "ticker/kuswap": retrievals.GraphQLQuery({
	//     url: "https://info.kuswap.finance/subgraphs/name/kuswap/swap",
	//     ...defaultQuery,
	//     ...defaultScript,
	//     samples: {
	//         "kuc/kcs": [ "0x1ee6b0f7302b3c48c5fa89cd0a066309d9ac3584", "0" ]
	//     },
	// }),
	"ticker/mojitoswap": retrievals.GraphQLQuery({
		url: "https://thegraph.kcc.network/subgraphs/name/mojito/swap",
		...defaultQuery,
		...defaultScript,
		samples: {
			"kcs/usdt": ["0xb3b92d6b2656f9ceb4a381718361a21bf9b82bd9", "0"],
			"mjt/kcs": ["0xa0d7c8aa789362cdf4faae24b9d1528ed5a3777f", "1"],
			"sax/usdt": ["0x1162131b63d95210acf5b3419d38c68492f998cc", "0"],
		},
	}),
	"ticker#9/mojitoswap": retrievals.GraphQLQuery({
		url: "https://thegraph.kcc.network/subgraphs/name/mojito/swap",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getMap("data")
			.getMap("pair")
			.getFloat("token\\1\\Price")
			.multiply(1e9)
			.round(),
		...defaultQuery,
	}),
	// "ticker/oolongswap": retrievals.GraphQLQuery({
	//     url: "https://api.thegraph.com/subgraphs/name/oolongswap/oolongswap-mainnet",
	//     query: `{ pairs ( where: { token0: "\\0\\", token1: "\\1\\" }) { token1Price } }`,
	//     script: RadonScript(RadonString).parseJSONMap().getMap("data").getArray("pairs").getMap(0).getFloat("token1Price").multiply(1e6).round(),
	//     samples: {
	//         "olo/usdc": [ "0x5008f837883ea9a07271a1b5eb0658404f5a9610", "0x66a2a913e447d6b4bf33efbec43aaef87890fbbc" ],
	//     },
	// }),
	// "ticker/pancake_v2": retrievals.GraphQLQuery({
	//     url: "https://open-platform.nodereal.io/6eed3770d9874b5ca666625eb0628e9a/pancakeswap-free/graphql",
	//     ...defaultQuery,
	//     ...defaultScript,
	//     samples: {
	//         "hkd/usdt": [ "6a00e82398d210b36bf28094edf8ae96c543606b", "1" ],
	//     },
	// }),
	// "ticker/quickswap_v3": retrievals.GraphQLQuery({
	//     url: "https://api-next.thegraph.com/subgraphs/name/sameepsi/quickswap-v3",
	//     query: `{ pool (id: "\\0\\") { token\\1\\Price } }`,
	//     script: RadonScript(RadonString).parseJSONMap().getMap("data").getMap("pool").getFloat("token\\1\\Price").multiply(1e6).round(),
	//     samples: {
	//         "quick/usdc": [ "0x022df0b3341b3a0157eea97dd024a93f7496d631", "0" ],
	//     },
	// }),
	// "ticker#9/quickswap_v3": retrievals.GraphQLQuery({
	//     url: "https://api-next.thegraph.com/subgraphs/name/sameepsi/quickswap-v3",
	//     query: `{ pool (id: "\\0\\") { token\\1\\Price } }`,
	//     script: RadonScript(RadonString).parseJSONMap().getMap("data").getMap("pool").getFloat("token\\1\\Price").multiply(1e9).round(),
	// }),
	// "ticker/stellaswap": retrievals.GraphQLQuery({
	//     url: "https://analytics.stellaswap.com/api/graphql/stella-swap",
	//     ...defaultQuery,
	//     ...defaultScript,
	//     samples: {
	//         "stella/usdt": [ "0x81e11a9374033d11cc7e7485a7192ae37d0795d6", "1" ],
	//     },
	// }),
	// "ticker/sushiswap": retrievals.GraphQLQuery({
	//     url: "https://api.thegraph.com/subgraphs/name/sushiswap/matic-exchange",
	//     ...defaultQuery,
	//     ...defaultScript,
	//     samples: {
	//         "vsq/dai": [ "0x5cf66ceaf7f6395642cd11b5929499229edef531", "1" ],
	//     },
	// }),
	"ticker/ubeswap": retrievals.GraphQLQuery({
		url: "https://api.thegraph.com/subgraphs/name/ubeswap/ubeswap",
		query: `
            query PairsCurrent { 
                pairs (first: 100, orderBy: reserveUSD, orderDirection: desc, subgraphError: allow) {
                    id token\\1\\Price 
                } 
            }`,
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getMap("data")
			.getArray("pairs")
			.filter(
				RadonScript(RadonMap)
					.getString("id")
					.match(RadonBoolean, { "\\0\\": true }, false),
			)
			.getMap(0)
			.getFloat("token\\1\\Price")
			.multiply(1e6)
			.round(),
		samples: {
			"immo/mcusd": ["0x7d63809ebf83ef54c7ce8ded3591d4e8fc2102ee", "0"],
		},
	}),
	// "ticker/uniswap#celo": retrievals.GraphQLQuery({
	//     url: "https://api.thegraph.com/subgraphs/name/jesse-sawa/uniswap-celo",
	//     query: `{ pool (id: "\\0\\") { token\\1\\Price } }`,
	//     script: RadonScript(RadonString).parseJSONMap().getMap("data").getMap("pool").getFloat("token\\1\\Price").multiply(1e6).round(),
	//     samples: {
	//         "nct/celo": [ "0xdb24905b1b080f65dedb0ad978aad5c76363d3c6", "1" ],
	//     },
	// }),
	// "ticker/uniswap_v3": retrievals.GraphQLQuery({
	//     url: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
	//     query: `{ pool (id: "\\0\\") { token\\1\\Price } }`,
	//     script: RadonScript(RadonString).parseJSONMap().getMap("data").getMap("pool").getFloat("token\\1\\Price").multiply(1e6).round(),
	//     samples: {
	//         "frax/usdt": [ "0xc2a856c3aff2110c1171b8f942256d40e980c726", "1" ],
	//         "ulx/usdt": [ "0x9adf4617804c762f86fc4e706ad0424da3b100a7", "1" ],
	//     },
	// }),
};
