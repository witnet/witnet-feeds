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
};
