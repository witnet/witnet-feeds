const { Witnet } = require("@witnet/sdk");
const { PriceTickerTemplate } = require("../../utils.cjs");

const sources = Witnet.Radon.retrievals.fromRadonAssets(
	require("../../sources/index.cjs"),
);

module.exports = {
	WitOracleRequestTemplateBeamswapTicker6: PriceTickerTemplate({
		sources: sources["ticker/beamswap"],
		samples: {
			"GLINT/USDC-6": [["0x61b4cec9925b1397b64dece8f898047eed0f7a07", "0"]],
		},
	}),

	WitOracleRequestTemplateMojitoTicker6: PriceTickerTemplate({
		sources: sources["ticker/mojitoswap"],
		samples: {
			"KCS/USDT-6": [["0xb3b92d6b2656f9ceb4a381718361a21bf9b82bd9", "0"]],
			"MJT/KCS-6": [["0xa0d7c8aa789362cdf4faae24b9d1528ed5a3777f", "1"]],
			"SAX/USDT-6": [["0x1162131b63d95210acf5b3419d38c68492f998cc", "0"]],
		},
	}),

	WitOracleRequestTemplateMojitoTicker9: PriceTickerTemplate({
		sources: sources["ticker#9/mojitoswap"],
		samples: {
			"KCS/USDT-9": [["0xb3b92d6b2656f9ceb4a381718361a21bf9b82bd9", "0"]],
			"MJT/KCS-9": [["0xa0d7c8aa789362cdf4faae24b9d1528ed5a3777f", "1"]],
			"SAX/USDT": [["0x1162131b63d95210acf5b3419d38c68492f998cc", "0"]],
		},
	}),

	WitOracleRequestTemplateUbeswapTicker6: PriceTickerTemplate({
		sources: sources["ticker/ubeswap"],
		samples: {
			"IMMO/mCUSD-6": [["0x7d63809ebf83ef54c7ce8ded3591d4e8fc2102ee", "0"]],
		},
	}),
};
