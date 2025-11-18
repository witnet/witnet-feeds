const { PriceTickerRequest } = require("../../utils.cjs");

const templates = require("../../templates/tickers/crypto.cjs");

module.exports = {
	WitOracleRequestPriceCryptoAdaUsd6: PriceTickerRequest({
		"ticker/bitstamp.net": ["ada", "usd"],
		"ticker/coinbase.com": ["ADA", "USD"],
		"ticker/kraken.com": ["ADA", "USD"],
	}),

	WitOracleRequestPriceCryptoAlgoUsd6: PriceTickerRequest({
		"ticker/bitstamp.net": ["algo", "usd"],
		"ticker/coinbase.com": ["ALGO", "USD"],
		"ticker/kraken.com": ["ALGO", "USD"],
	}),

	WitOracleRequestPriceCryptoApeUsd6: PriceTickerRequest({
		"ticker/binance.us": ["APE", "USD"],
		"ticker/coinbase.com": ["APE", "USD"],
		"ticker/kraken.com": ["APE", "USD"],
	}),

	WitOracleRequestPriceCryptoAtomUsd6: PriceTickerRequest({
		"ticker/coinbase.com": ["ATOM", "USD"],
		"ticker/kraken.com": ["ATOM", "USD"],
	}),

	WitOracleRequestPriceCryptoAvaxUsd6: PriceTickerRequest({
		"ticker/binance.us": ["AVAX", "USD"],
		"ticker/bitstamp.net": ["avax", "usd"],
		"ticker/coinbase.com": ["AVAX", "USD"],
		"ticker/gemini.com": ["avax", "usd"],
		"ticker/kraken.com": ["AVAX", "USD"],
	}),

	WitOracleRequestPriceCryptoBatUsdt6: PriceTickerRequest({
		"ticker/binance.us": ["BAT", "USDT"],
		"ticker/bitrue.com": ["BATUSDT"],
		"ticker/coinbase.com": ["BAT", "USDT"],
		"ticker/okx.com": ["BAT", "USDT"],
		"ticker/upbit.com": ["BAT", "USDT"],
	}),

	WitOracleRequestPriceCryptoBnbUsdt6: PriceTickerRequest({
		"ticker/binance.com": ["BNB", "USDT"],
		"ticker/bybit.com": ["BNB", "USDT", "inverse"],
		"ticker/gateapi.io": ["bnb", "usdt"],
		"ticker/huobi.pro": ["bnb", "usdt"],
		"ticker/kucoin.com": ["BNB", "USDT"],
		"ticker/okx.com": ["BNB", "USDT"],
	}),

	WitOracleRequestPriceCryptoBobaUsdt6: PriceTickerRequest({
		"ticker/gateapi.io": ["boba", "usdt"],
		"ticker/huobi.pro": ["boba", "usdt"],
		"ticker/mexc.com": ["BOBA", "USDT"],
	}),

	WitOracleRequestPriceCryptoBoringUsdt6: PriceTickerRequest({
		"ticker/gateapi.io": ["boring", "usdt"],
		// "ticker/huobi.pro": ["boring", "usdt"],
		// "ticker/mexc.com": ["BORING", "USDT"],
		// "ticker/okx.com": ["BORING", "USDT"]
	}),

	WitOracleRequestPriceCryptoBtcUsd6: PriceTickerRequest({
		"ticker/binance.us": ["BTC", "USD"],
		"ticker/bitfinex.com": ["btc", "usd"],
		"ticker/bitstamp.net": ["btc", "usd"],
		"ticker/coinbase.com": ["BTC", "USD"],
		"ticker/gemini.com": ["btc", "usd"],
		"ticker/kraken.com": ["BTC", "USD"],
	}),

	WitOracleRequestPriceCryptoBusdUsdt6: PriceTickerRequest({
		"ticker/binance.com": ["BUSD", "USDT"],
	}),

	WitOracleRequestPriceCryptoCeloEur6: PriceTickerRequest({
		"ticker/bitvavo.com": ["CELO", "EUR"],
		"ticker/coinbase.com": ["CGLD", "EUR"],
	}),

	WitOracleRequestPriceCryptoCeloUsd6: PriceTickerRequest({
		"ticker/binance.us": ["CELO", "USD"],
		"ticker/coinbase.com": ["CGLD", "USD"],
		"ticker/okx.com": ["CELO", "USDT"],
	}),

	WitOracleRequestPriceCryptoCfxUsdt6: PriceTickerRequest({
		"ticker/binance.com": ["CFX", "USDT"],
		"ticker/gateapi.io": ["cfx", "usdt"],
		"ticker/kucoin.com": ["CFX", "USDT"],
		"ticker/okx.com": ["CFX", "USDT"],
		"ticker/mexc.com": ["CFX", "USDT"],
	}),

	WitOracleRequestPriceCryptoCroUsdt6: PriceTickerRequest({
		"ticker/coinbase.com": ["CRO", "USDT"],
		"ticker/gateapi.io": ["cro", "usdt"],
		"ticker/kucoin.com": ["CRO", "USDT"],
		"ticker/mexc.com": ["CRO", "USDT"],
		"ticker/okx.com": ["CRO", "USDT"],
	}),

	WitOracleRequestPriceCryptoDaiUsd6: PriceTickerRequest({
		"ticker/binance.us": ["DAI", "USD"],
		"ticker/bitstamp.net": ["dai", "usd"],
		"ticker/coinbase.com": ["DAI", "USD"],
		"ticker/gateapi.io": ["dai", "usd"],
		"ticker/gemini.com": ["dai", "usd"],
		"ticker/kraken.com": ["DAI", "USD"],
	}),

	WitOracleRequestPriceCryptoDogeUsd6: PriceTickerRequest({
		"ticker/binance.us": ["DOGE", "USD"],
		"ticker/coinbase.com": ["DOGE", "USD"],
		"ticker/kraken.com": ["DOGE", "USD"],
	}),

	WitOracleRequestPriceCryptoDotUsd6: PriceTickerRequest({
		// "ticker/bittrex.com": ["DOT", "USD"],
		"ticker/coinbase.com": ["DOT", "USD"],
		"ticker/kraken.com": ["DOT", "USD"],
	}),

	WitOracleRequestPriceCryptoElaUsdt6: PriceTickerRequest({
		"ticker/gateapi.io": ["ela", "usdt"],
		"ticker/huobi.pro": ["ela", "usdt"],
		"ticker/kucoin.com": ["ELA", "USDT"],
	}),

	WitOracleRequestPriceCryptoElonUsdt9: PriceTickerRequest({
		"ticker#9/gateapi.io": ["elon", "usdt"],
		"ticker#9/huobi.pro": ["elon", "usdt"],
		"ticker#9/kucoin.com": ["ELON", "USDT"],
		"ticker#9/mexc.com": ["ELON", "USDT"],
		"ticker#9/okx.com": ["ELON", "USDT"],
	}),

	WitOracleRequestPriceCryptoEosUsd6: PriceTickerRequest({
		// "ticker/ascendex.com": ["EOS", "USD"],
		"ticker/bitfinex.com": ["eos", "usd"],
		"ticker/coinbase.com": ["EOS", "USD"],
		// "ticker/kraken.com": ["EOS", "USD"]
	}),

	WitOracleRequestPriceCryptoEthUsd6: PriceTickerRequest({
		"ticker/binance.us": ["ETH", "USD"],
		"ticker/bitfinex.com": ["eth", "usd"],
		"ticker/bitstamp.net": ["eth", "usd"],
		"ticker/coinbase.com": ["ETH", "USD"],
		"ticker/kraken.com": ["ETH", "USD"],
		"ticker/gemini.com": ["eth", "usd"],
	}),

	WitOracleRequestPriceCryptoFraxUsdt6: PriceTickerRequest({
		"ticker/gateapi.io": ["frax", "usdt"],
	}),

	WitOracleRequestPriceCryptoFtmUsdt6: PriceTickerRequest({
		// "ticker/binance.com": ["SONIC", "USDT"],
		"ticker/bybit.com": ["SONIC", "USDT", "inverse"],
		// "ticker/digifinex.com": ["sonic", "usdt"],
		"ticker/gateapi.io": ["sonic", "usdt"],
		// "ticker/huobi.pro": ["sonic", "usdt"],
		"ticker/kucoin.com": ["SONIC", "USDT"],
		"ticker/mexc.com": ["SONIC", "USDT"],
		"ticker/okx.com": ["SONIC", "USDT"],
	}),

	WitOracleRequestPriceCryptoFuseUsdt6: PriceTickerRequest({
		"ticker/ascendex.com": ["FUSE", "USDT"],
		"ticker/gateapi.io": ["fuse", "usdt"],
		"ticker/huobi.pro": ["fuse", "usdt"],
		"ticker/mexc.com": ["FUSE", "USDT"],
	}),

	WitOracleRequestPriceCryptoGlintUsdc6:
		templates.WitOracleRequestTemplateBeamswapTicker6.buildRadonRequest([
			"0x61b4cec9925b1397b64dece8f898047eed0f7a07",
			"0",
		]),

	WitOracleRequestPriceCryptoGlmrUsdt6: PriceTickerRequest({
		"ticker/binance.com": ["GLMR", "USDT"],
		"ticker/gateapi.io": ["glmr", "usdt"],
		"ticker/kucoin.com": ["GLMR", "USDT"],
		"ticker/mexc.com": ["GLMR", "USDT"],
		// "ticker/okx.com": ["GLMR", "USDT"]
	}),

	WitOracleRequestPriceCryptoHtUsdt6: PriceTickerRequest({
		// "ticker/ascendex.com": ["HT", "USDT"],
		"ticker/gateapi.io": ["ht", "usdt"],
		// "ticker/huobi.pro": ["ht", "usdt"],
		// "ticker/mexc.com": ["HT", "USDT"]
	}),

	WitOracleRequestPriceCryptoImmoMcusd6:
		templates.WitOracleRequestTemplateUbeswapTicker6.buildRadonRequest([
			"0x7d63809ebf83ef54c7ce8ded3591d4e8fc2102ee",
			"0",
		]),

	WitOracleRequestPriceCryptoKaiaUsdt6: PriceTickerRequest({
		"ticker/binance.com": ["KAIA", "USDT"],
		"ticker/bitget.com_v2": ["KAIA", "USDT"],
		"ticker/bybit.com": ["KAIA", "USDT", "spot"],
		"ticker/okx.com": ["KAIA", "USDT"],
		"ticker/gateapi.io": ["kaia", "usdt"],
	}),

	WitOracleRequestPriceCryptoKavaUsdt6: PriceTickerRequest({
		"ticker/binance.com": ["KAVA", "USDT"],
		"ticker/gateapi.io": ["kava", "usdt"],
		"ticker/huobi.pro": ["kava", "usdt"],
		"ticker/kucoin.com": ["KAVA", "USDT"],
		"ticker/mexc.com": ["KAVA", "USDT"],
	}),

	WitOracleRequestPriceCryptoKcsUsdt6: PriceTickerRequest({
		// "ticker/ascendex.com": ["KCS", "USDT"],
		"ticker/bybit.com": ["KCS", "USDT", "spot"],
		"ticker/kucoin.com": ["KCS", "USDT"],
		// "ticker/mexc.com": ["KCS", "USDT"],
		"ticker/mojitoswap": ["0xb3b92d6b2656f9ceb4a381718361a21bf9b82bd9", "0"],
	}),

	// WitOracleRequestPriceCryptoKspKrw6: PriceTickerRequest({
	// 	// "ticker/coinone.co.kr": ["krw", "ksp"],
	// 	// "ticker/korbit.co.kr": ["ksp", "krw"]
	// }),

	WitOracleRequestPriceCryptoLinkUsd6: PriceTickerRequest({
		"ticker/bitstamp.net": ["link", "usd"],
		"ticker/coinbase.com": ["LINK", "USD"],
		"ticker/kraken.com": ["LINK", "USD"],
	}),

	WitOracleRequestPriceCryptoPolUsd6: PriceTickerRequest({
		"ticker/binance.us": ["POL", "USD"],
		"ticker/bitstamp.net": ["pol", "usd"],
		"ticker/coinbase.com": ["POL", "USD"],
		"ticker/kraken.com": ["POL", "USD"],
	}),

	WitOracleRequestPriceCryptoMetisUsdt6: PriceTickerRequest({
		"ticker/gateapi.io": ["metis", "usdt"],
		"ticker/kucoin.com": ["METIS", "USDT"],
		"ticker/mexc.com": ["METIS", "USDT"],
	}),

	WitOracleRequestPriceCryptoMjtKcs9: PriceTickerRequest({
		"ticker#9/mojitoswap": ["0xa0d7c8aa789362cdf4faae24b9d1528ed5a3777f", "1"],
	}),

	WitOracleRequestPriceCryptoMntUsdt6: PriceTickerRequest({
		"ticker/bitmart.com": ["MNT", "USDT"],
		"ticker/gateapi.io": ["mnt", "usdt"],
		"ticker/mexc.com/v3": ["MNT", "USDT"],
	}),

	WitOracleRequestPriceCryptoMtrUsdt6: PriceTickerRequest({
		"ticker/gateapi.io": ["mtr", "usdt"],
		// "ticker/mexc.com/v3": ["MTR", "USDT"]
	}),

	WitOracleRequestPriceCryptoMtrgUsdt6: PriceTickerRequest({
		"ticker/gateapi.io": ["mtrg", "usdt"],
		"ticker/kucoin.com": ["MTRG", "USDT"],
		"ticker/mexc.com/v3": ["MTRG", "USDT"],
	}),

	// WitOracleRequestPriceCryptoNctCelo6: templates.WitOracleRequestTemplateUniswapCeloTicker6
	//     .buildRadonRequest(
	//         ["0xdb24905b1b080f65dedb0ad978aad5c76363d3c6", "1"]
	//     ),

	WitOracleRequestPriceCryptoOkbUsdt6: PriceTickerRequest({
		"ticker/gateapi.io": ["okb", "usdt"],
		"ticker/okx.com": ["OKB", "USDT"],
		"ticker/mexc.com": ["OKB", "USDT"],
	}),

	WitOracleRequestPriceCryptoOktUsdt6: PriceTickerRequest({
		"ticker/gateapi.io": ["okt", "usdt"],
		// "ticker/okx.com": ["OKT", "USDT"],
		// "ticker/mexc.com": ["OKT", "USDT"]
	}),

	// WitOracleRequestPriceCryptoOloUsdc6: templates.WitOracleRequestTemplateOolongTicker6
	//     .buildRadonRequest(
	//         ["0x5008f837883ea9a07271a1b5eb0658404f5a9610", "0x66a2a913e447d6b4bf33efbec43aaef87890fbbc"],
	//     ),

	WitOracleRequestPriceCryptoOpUsdt6: PriceTickerRequest({
		"ticker/okx.com": ["OP", "USDT"],
		"ticker/binance.com": ["OP", "USDT"],
		"ticker/digifinex.com": ["op", "usdt"],
		"ticker/gateapi.io": ["op", "usdt"],
		"ticker/kucoin.com": ["OP", "USDT"],
	}),

	// WitOracleRequestPriceCryptoQuickUsdc6: templates.WitOracleRequestTemplateQuickswapTicker6
	//     .buildRadonRequest(
	//         ["0x022df0b3341b3a0157eea97dd024a93f7496d631", "0"],
	//     ),

	// WitOracleRequestPriceCryptoQuickWeth9: templates.WitOracleRequestTemplateQuickswapTicker9
	//     .buildRadonRequest(
	//         ["0xde2d1fd2e8238aba80a5b80c7262e4833d92f624", "0"]
	//     ),

	// WitOracleRequestPriceCryptoQuickWmatic6: templates.WitOracleRequestTemplateQuickswapTicker6
	//     .buildRadonRequest(
	//         ["0x9f1a8caf3c8e94e43aa64922d67dff4dc3e88a42", "0"],
	//     ),

	WitOracleRequestPriceCryptoReefUsdt6: PriceTickerRequest({
		"ticker/binance.com": ["REEF", "USDT"],
		"ticker/bitrue.com": ["REEFUSDT"],
		"ticker/digifinex.com": ["reef", "usdt"],
		"ticker/gateapi.io": ["reef", "usdt"],
		"ticker/kucoin.com": ["REEF", "USDT"],
	}),

	WitOracleRequestPriceCryptoSaxUsdt6: PriceTickerRequest({
		"ticker/mojitoswap": ["0x1162131b63d95210acf5b3419d38c68492f998cc", "0"],
	}),

	WitOracleRequestPriceCryptoShibUsd9: PriceTickerRequest({
		"ticker#9/coinbase.com": ["SHIB", "USD"],
		"ticker#9/gateapi.io": ["shib", "usd"],
		"ticker#9/kraken.com": ["SHIB", "USD"],
	}),

	WitOracleRequestPriceCryptoSolUsd6: PriceTickerRequest({
		"ticker/coinbase.com": ["SOL", "USD"],
		"ticker/kraken.com": ["SOL", "USD"],
	}),

	// WitOracleRequestPriceCryptoStellaUsdt6: templates.WitOracleRequestTemplateStellaswapTicker6
	//     .buildRadonRequest(
	//         ["0x81e11a9374033d11cc7e7485a7192ae37d0795d6", "1"],
	//     ),

	WitOracleRequestPriceCryptoSysUsdt6: PriceTickerRequest({
		"ticker/binance.com": ["SYS", "USDT"],
		"ticker/bitget.com": ["SYSUSDT_SPBL"],
		"ticker/digifinex.com": ["sys", "usdt"],
		"ticker#9/gateapi.io": ["sys", "usdt"],
		"ticker/kucoin.com": ["SYS", "USDT"],
		"ticker/mexc.com": ["SYS", "USDT"],
	}),

	WitOracleRequestPriceCryptoTusdUsdt6: PriceTickerRequest({
		"ticker/binance.com": ["TUSD", "USDT"],
		"ticker/huobi.pro": ["tusd", "usdt"],
	}),

	// WitOracleRequestPriceCryptoUlxUsdt6: PriceTickerRequest(
	//     {
	//         "ticker/uniswap_v3": ["0x9adf4617804c762f86fc4e706ad0424da3b100a7", "1"]
	//     }
	// ),

	WitOracleRequestPriceCryptoUniUsd6: PriceTickerRequest({
		"ticker/bitfinex.com": ["uni", "usd"],
		"ticker/bitstamp.net": ["uni", "usd"],
		"ticker/coinbase.com": ["UNI", "USD"],
		"ticker/gemini.com": ["uni", "usd"],
		"ticker/kraken.com": ["UNI", "USD"],
	}),

	WitOracleRequestPriceCryptoUsdcUsd6: PriceTickerRequest({
		"ticker/bitstamp.net": ["usdc", "usd"],
		"ticker/gemini.com": ["usdc", "usd"],
		"ticker/kraken.com": ["USDC", "USD"],
	}),

	WitOracleRequestPriceCryptoUsdtUsd6: PriceTickerRequest({
		"ticker/kraken.com": ["USDT", "USD"],
		"ticker/binance.us": ["USDT", "USD"],
		"ticker/bitstamp.net": ["usdt", "usd"],
		"ticker/coinbase.com": ["USDT", "USD"],
		"ticker/gemini.com": ["usdt", "usd"],
	}),

	// WitOracleRequestPriceCryptoVsqDai6: templates.WitOracleRequestTemplateSushiswapTicker6
	//     .buildRadonRequest(
	//         ["0x5cf66ceaf7f6395642cd11b5929499229edef531", "1"],
	//     ),

	WitOracleRequestPriceCryptoWbtcUsd6: PriceTickerRequest({
		"ticker/bitfinex.com": ["wbt", "usd"],
		"ticker/coinbase.com": ["WBTC", "USD"],
		"ticker/kraken.com": ["WBTC", "USD"],
	}),

	WitOracleRequestPriceCryptoWbtcWulx6: PriceTickerRequest({
		"ticker/ultron-dev.net": [
			"0xd2b86a80a8f30b83843e247a50ecdc8d843d87dd",
			"0x3a4f06431457de873b588846d139ec0d86275d54",
		],
	}),

	WitOracleRequestPriceCryptoWethWulx6: PriceTickerRequest({
		"ticker/ultron-dev.net#inverse": [
			"0x2318bf5809a72aabadd15a3453a18e50bbd651cd",
			"0x3a4f06431457de873b588846d139ec0d86275d54",
		],
	}),

	WitOracleRequestPriceCryptoWitUsdt6: PriceTickerRequest({
		"ticker/mexc.com": ["WIT", "USDT"],
		// "ticker/bitmart.com": ["WIT", "USDT"],
		// "ticker/gateapi.io": ["wit", "usdt"],
	}),

	WitOracleRequestPriceCryptoWldUsdt6: PriceTickerRequest({
		"ticker/binance.com": ["WLD", "USDT"],
		"ticker/bitget.com": ["WLDUSDT_SPBL"],
		"ticker/bitmart.com": ["WLD", "USDT"],
		"ticker/bybit.com": ["WLD", "USDT", "inverse"],
		"ticker/gateapi.io": ["wld", "usdt"],
		"ticker/kucoin.com": ["WLD", "USDT"],
		"ticker/mexc.com": ["WLD", "USDT"],
		"ticker/okx.com": ["WLD", "USDT"],
	}),

	WitOracleRequestPriceCryptoXlmUsd6: PriceTickerRequest({
		"ticker/bitstamp.net": ["xlm", "usd"],
		"ticker/coinbase.com": ["XLM", "USD"],
		"ticker/kraken.com": ["XLM", "USD"],
	}),
};
