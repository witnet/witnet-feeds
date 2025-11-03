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

	// WitOracleRequestTemplateKuswapTicker6: PriceTickerTemplate({
	//     sources: sources['ticker/kuswap'],
	//     samples: {
	//         "KUS/KCS-6": [[ "0x1ee6b0f7302b3c48c5fa89cd0a066309d9ac3584", "0" ]],
	//     },
	// }),

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

	// WitOracleRequestTemplateOolongTicker6: PriceTickerTemplate({
	//     sources: sources['ticker/oolongswap'],
	//     samples: {
	//         "OLO/USDC-6": [[
	//             "0x5008f837883ea9a07271a1b5eb0658404f5a9610",
	//             "0x66a2a913e447d6b4bf33efbec43aaef87890fbbc"
	//         ]],
	//     },
	// }),

	// WitOracleRequestTemplatePancakeBscExchangeTicker6: PriceTickerTemplate({
	//     sources: sources['ticker/pancake_v2'],
	//     samples: {
	//         "HKD/USDT-6": [[
	//             "6a00e82398d210b36bf28094edf8ae96c543606b",
	//             "1"
	//         ]],
	//     }
	// }),

	// WitOracleRequestTemplateQuickswapTicker6: PriceTickerTemplate({
	//     sources: sources['ticker/quickswap_v3'],
	//     samples: {
	//         "QUICK/USDC-6": [[ "0x022df0b3341b3a0157eea97dd024a93f7496d631", "0" ]],
	//     },
	// }),

	// WitOracleRequestTemplateQuickswapTicker9: PriceTickerTemplate({
	//     sources: sources['ticker#9/quickswap_v3'],
	//     samples: {
	//         "QUICK/USDC-9": [[ "0x022df0b3341b3a0157eea97dd024a93f7496d631", "0" ]],
	//     },
	// }),

	// WitOracleRequestTemplateStellaswapTicker6: PriceTickerTemplate({
	//     sources: sources['ticker/stellaswap'],
	//     samples: {
	//         "STELLA/USDT-6": [[ "0x81e11a9374033d11cc7e7485a7192ae37d0795d6", "1" ]],
	//     },
	// }),
	// WitOracleRequestTemplateSushiswapTicker6: PriceTickerTemplate({
	//     sources: sources['ticker/sushiswap'],
	//     samples: {
	//         "VSQ/DAI-6": [[ "0x5cf66ceaf7f6395642cd11b5929499229edef531", "1" ]],
	//     },
	// }),

	WitOracleRequestTemplateUbeswapTicker6: PriceTickerTemplate({
		sources: sources["ticker/ubeswap"],
		samples: {
			"IMMO/mCUSD-6": [["0x7d63809ebf83ef54c7ce8ded3591d4e8fc2102ee", "0"]],
		},
	}),

	// WitOracleRequestTemplateUniswapCeloTicker6: PriceTickerTemplate({
	//     sources: sources['ticker/uniswap#celo'],
	//     samples: {
	//         "NCT/CELO-6": [[ "0xdb24905b1b080f65dedb0ad978aad5c76363d3c6", "1" ]],
	//     },
	// }),

	// WitOracleRequestTemplateUniswapV3Ticker6: PriceTickerTemplate({
	//     sources: sources['ticker/uniswap_v3'],
	//     samples: {
	//         "FRAX/USDT-6": [[ "0xc2a856c3aff2110c1171b8f942256d40e980c726", "1" ]],
	//         "ULX/USDT-6": [[ "0x9adf4617804c762f86fc4e706ad0424da3b100a7", "1" ]],
	//     },
	// }),
};
