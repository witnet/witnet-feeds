const { PriceTickerRequest } = require("../../utils.cjs");

const templates = require("../../templates/tickers/crypto.cjs");

module.exports = {
	WitOracleRequestPriceAdaUsd6: PriceTickerRequest({
		"ticker/bitstamp.net": ["ada", "usd"],
		"ticker/coinbase.com": ["ADA", "USD"],
		"ticker/kraken.com": ["ADA", "USD"],
	}),

	WitOracleRequestPriceAlgoUsd6: PriceTickerRequest({
		"ticker/bitstamp.net": ["algo", "usd"],
		"ticker/coinbase.com": ["ALGO", "USD"],
		"ticker/kraken.com": ["ALGO", "USD"],
	}),

	WitOracleRequestPriceApeUsd6: PriceTickerRequest({
		"ticker/binance.us": ["APE", "USD"],
		"ticker/coinbase.com": ["APE", "USD"],
		"ticker/kraken.com": ["APE", "USD"],
	}),

	WitOracleRequestPriceAtomUsd6: PriceTickerRequest({
		"ticker/coinbase.com": ["ATOM", "USD"],
		"ticker/kraken.com": ["ATOM", "USD"],
	}),

	WitOracleRequestPriceAvaxUsd6: PriceTickerRequest({
		"ticker/binance.us": ["AVAX", "USD"],
		"ticker/bitstamp.net": ["avax", "usd"],
		"ticker/coinbase.com": ["AVAX", "USD"],
		"ticker/gemini.com": ["avax", "usd"],
		"ticker/kraken.com": ["AVAX", "USD"],
	}),

	WitOracleRequestPriceBatUsdt6: PriceTickerRequest({
		"ticker/binance.us": ["BAT", "USDT"],
		"ticker/bitrue.com": ["BATUSDT"],
		"ticker/coinbase.com": ["BAT", "USDT"],
		"ticker/okx.com": ["BAT", "USDT"],
		"ticker/upbit.com": ["BAT", "USDT"],
	}),

	WitOracleRequestPriceBnbUsdt6: PriceTickerRequest({
		"ticker/binance.com": ["BNB", "USDT"],
		"ticker/bybit.com": ["BNB", "USDT", "inverse"],
		"ticker/gateapi.io": ["bnb", "usdt"],
		"ticker/huobi.pro": ["bnb", "usdt"],
		"ticker/kucoin.com": ["BNB", "USDT"],
		"ticker/okx.com": ["BNB", "USDT"],
	}),

	WitOracleRequestPriceBobaUsdt6: PriceTickerRequest({
		"ticker/gateapi.io": ["boba", "usdt"],
		"ticker/huobi.pro": ["boba", "usdt"],
		"ticker/mexc.com": ["BOBA", "USDT"],
	}),

	WitOracleRequestPriceBtcUsd6: PriceTickerRequest({
		"ticker/binance.us": ["BTC", "USD"],
		"ticker/bitfinex.com": ["btc", "usd"],
		"ticker/bitstamp.net": ["btc", "usd"],
		"ticker/coinbase.com": ["BTC", "USD"],
		"ticker/gemini.com": ["btc", "usd"],
		"ticker/kraken.com": ["BTC", "USD"],
	}),

	WitOracleRequestPriceBusdUsdt6: PriceTickerRequest({
		"ticker/binance.com": ["BUSD", "USDT"],
	}),

	WitOracleRequestPriceCeloEur6: PriceTickerRequest({
		"ticker/bitvavo.com": ["CELO", "EUR"],
		"ticker/coinbase.com": ["CGLD", "EUR"],
	}),

	WitOracleRequestPriceCeloUsd6: PriceTickerRequest({
		"ticker/binance.us": ["CELO", "USD"],
		"ticker/coinbase.com": ["CGLD", "USD"],
		"ticker/okx.com": ["CELO", "USDT"],
	}),

	WitOracleRequestPriceCfxUsdt6: PriceTickerRequest({
		"ticker/binance.com": ["CFX", "USDT"],
		"ticker/gateapi.io": ["cfx", "usdt"],
		"ticker/kucoin.com": ["CFX", "USDT"],
		"ticker/okx.com": ["CFX", "USDT"],
		"ticker/mexc.com": ["CFX", "USDT"],
	}),

	WitOracleRequestPriceCroUsdt6: PriceTickerRequest({
		"ticker/coinbase.com": ["CRO", "USDT"],
		"ticker/gateapi.io": ["cro", "usdt"],
		"ticker/kucoin.com": ["CRO", "USDT"],
		"ticker/mexc.com": ["CRO", "USDT"],
		"ticker/okx.com": ["CRO", "USDT"],
	}),

	WitOracleRequestPriceDaiUsd6: PriceTickerRequest({
		"ticker/binance.us": ["DAI", "USD"],
		"ticker/bitstamp.net": ["dai", "usd"],
		"ticker/coinbase.com": ["DAI", "USD"],
		"ticker/gateapi.io": ["dai", "usd"],
		"ticker/gemini.com": ["dai", "usd"],
		"ticker/kraken.com": ["DAI", "USD"],
	}),

	WitOracleRequestPriceDogeUsd6: PriceTickerRequest({
		"ticker/binance.us": ["DOGE", "USD"],
		"ticker/coinbase.com": ["DOGE", "USD"],
		"ticker/kraken.com": ["DOGE", "USD"],
	}),

	WitOracleRequestPriceDotUsd6: PriceTickerRequest({
		"ticker/coinbase.com": ["DOT", "USD"],
		"ticker/kraken.com": ["DOT", "USD"],
	}),

	WitOracleRequestPriceElaUsdt6: PriceTickerRequest({
		"ticker/gateapi.io": ["ela", "usdt"],
		"ticker/huobi.pro": ["ela", "usdt"],
		"ticker/kucoin.com": ["ELA", "USDT"],
	}),

	WitOracleRequestPriceElonUsdt9: PriceTickerRequest({
		"ticker#9/gateapi.io": ["elon", "usdt"],
		"ticker#9/huobi.pro": ["elon", "usdt"],
		"ticker#9/kucoin.com": ["ELON", "USDT"],
		"ticker#9/mexc.com": ["ELON", "USDT"],
		"ticker#9/okx.com": ["ELON", "USDT"],
	}),

	WitOracleRequestPriceEosUsd6: PriceTickerRequest({
		"ticker/bitfinex.com": ["eos", "usd"],
		"ticker/coinbase.com": ["EOS", "USD"],
	}),

	WitOracleRequestPriceEthUsd6: PriceTickerRequest({
		"ticker/binance.us": ["ETH", "USD"],
		"ticker/bitfinex.com": ["eth", "usd"],
		"ticker/bitstamp.net": ["eth", "usd"],
		"ticker/coinbase.com": ["ETH", "USD"],
		"ticker/kraken.com": ["ETH", "USD"],
		"ticker/gemini.com": ["eth", "usd"],
	}),

	WitOracleRequestPriceFraxUsdt6: PriceTickerRequest({
		"ticker/gateapi.io": ["frax", "usdt"],
	}),

	WitOracleRequestPriceFtmUsdt6: PriceTickerRequest({
		"ticker/bybit.com": ["SONIC", "USDT", "inverse"],
		"ticker/gateapi.io": ["sonic", "usdt"],
		"ticker/kucoin.com": ["SONIC", "USDT"],
		"ticker/mexc.com": ["SONIC", "USDT"],
		"ticker/okx.com": ["SONIC", "USDT"],
	}),

	WitOracleRequestPriceFuseUsdt6: PriceTickerRequest({
		"ticker/ascendex.com": ["FUSE", "USDT"],
		"ticker/gateapi.io": ["fuse", "usdt"],
		"ticker/huobi.pro": ["fuse", "usdt"],
		"ticker/mexc.com": ["FUSE", "USDT"],
	}),

	WitOracleRequestPriceGlintUsdc6:
		templates.WitOracleRequestTemplateBeamswapTicker6.buildRadonRequest([
			"0x61b4cec9925b1397b64dece8f898047eed0f7a07",
			"0",
		]),

	WitOracleRequestPriceGlmrUsdt6: PriceTickerRequest({
		"ticker/binance.com": ["GLMR", "USDT"],
		"ticker/gateapi.io": ["glmr", "usdt"],
		"ticker/kucoin.com": ["GLMR", "USDT"],
		"ticker/mexc.com": ["GLMR", "USDT"],
	}),

	WitOracleRequestPriceHtUsdt6: PriceTickerRequest({
		"ticker/gateapi.io": ["ht", "usdt"],
	}),

	WitOracleRequestPriceImmoMcusd6:
		templates.WitOracleRequestTemplateUbeswapTicker6.buildRadonRequest([
			"0x7d63809ebf83ef54c7ce8ded3591d4e8fc2102ee",
			"0",
		]),

	WitOracleRequestPriceKaiaUsdt6: PriceTickerRequest({
		"ticker/binance.com": ["KAIA", "USDT"],
		"ticker/bitget.com_v2": ["KAIA", "USDT"],
		"ticker/bybit.com": ["KAIA", "USDT", "spot"],
		"ticker/okx.com": ["KAIA", "USDT"],
		"ticker/gateapi.io": ["kaia", "usdt"],
	}),

	WitOracleRequestPriceKavaUsdt6: PriceTickerRequest({
		"ticker/binance.com": ["KAVA", "USDT"],
		"ticker/gateapi.io": ["kava", "usdt"],
		"ticker/huobi.pro": ["kava", "usdt"],
		"ticker/kucoin.com": ["KAVA", "USDT"],
		"ticker/mexc.com": ["KAVA", "USDT"],
	}),

	WitOracleRequestPriceKcsUsdt6: PriceTickerRequest({
		"ticker/bybit.com": ["KCS", "USDT", "spot"],
		"ticker/kucoin.com": ["KCS", "USDT"],
		"ticker/mojitoswap": ["0xb3b92d6b2656f9ceb4a381718361a21bf9b82bd9", "0"],
	}),

	WitOracleRequestPriceLinkUsd6: PriceTickerRequest({
		"ticker/bitstamp.net": ["link", "usd"],
		"ticker/coinbase.com": ["LINK", "USD"],
		"ticker/kraken.com": ["LINK", "USD"],
	}),

	WitOracleRequestPricePolUsd6: PriceTickerRequest({
		"ticker/binance.us": ["POL", "USD"],
		"ticker/bitstamp.net": ["pol", "usd"],
		"ticker/coinbase.com": ["POL", "USD"],
		"ticker/kraken.com": ["POL", "USD"],
	}),

	WitOracleRequestPriceMetisUsdt6: PriceTickerRequest({
		"ticker/gateapi.io": ["metis", "usdt"],
		"ticker/kucoin.com": ["METIS", "USDT"],
		"ticker/mexc.com": ["METIS", "USDT"],
	}),

	WitOracleRequestPriceMjtKcs9: PriceTickerRequest({
		"ticker#9/mojitoswap": ["0xa0d7c8aa789362cdf4faae24b9d1528ed5a3777f", "1"],
	}),

	WitOracleRequestPriceMntUsdt6: PriceTickerRequest({
		"ticker/bitmart.com": ["MNT", "USDT"],
		"ticker/gateapi.io": ["mnt", "usdt"],
		"ticker/mexc.com/v3": ["MNT", "USDT"],
	}),

	WitOracleRequestPriceMtrUsdt6: PriceTickerRequest({
		"ticker/gateapi.io": ["mtr", "usdt"],
	}),

	WitOracleRequestPriceMtrgUsdt6: PriceTickerRequest({
		"ticker/gateapi.io": ["mtrg", "usdt"],
		"ticker/kucoin.com": ["MTRG", "USDT"],
		"ticker/mexc.com/v3": ["MTRG", "USDT"],
	}),

	WitOracleRequestPriceOkbUsdt6: PriceTickerRequest({
		"ticker/gateapi.io": ["okb", "usdt"],
		"ticker/okx.com": ["OKB", "USDT"],
		"ticker/mexc.com": ["OKB", "USDT"],
	}),

	WitOracleRequestPriceOktUsdt6: PriceTickerRequest({
		"ticker/gateapi.io": ["okt", "usdt"],
	}),

	WitOracleRequestPriceOpUsdt6: PriceTickerRequest({
		"ticker/okx.com": ["OP", "USDT"],
		"ticker/binance.com": ["OP", "USDT"],
		"ticker/digifinex.com": ["op", "usdt"],
		"ticker/gateapi.io": ["op", "usdt"],
		"ticker/kucoin.com": ["OP", "USDT"],
	}),

	WitOracleRequestPriceReefUsdt6: PriceTickerRequest({
		"ticker/binance.com": ["REEF", "USDT"],
		"ticker/bitrue.com": ["REEFUSDT"],
		"ticker/digifinex.com": ["reef", "usdt"],
		"ticker/gateapi.io": ["reef", "usdt"],
		"ticker/kucoin.com": ["REEF", "USDT"],
	}),

	WitOracleRequestPriceSaxUsdt6: PriceTickerRequest({
		"ticker/mojitoswap": ["0x1162131b63d95210acf5b3419d38c68492f998cc", "0"],
	}),

	WitOracleRequestPriceShibUsd9: PriceTickerRequest({
		"ticker#9/coinbase.com": ["SHIB", "USD"],
		"ticker#9/gateapi.io": ["shib", "usd"],
		"ticker#9/kraken.com": ["SHIB", "USD"],
	}),

	WitOracleRequestPriceSolUsd6: PriceTickerRequest({
		"ticker/coinbase.com": ["SOL", "USD"],
		"ticker/kraken.com": ["SOL", "USD"],
	}),

	WitOracleRequestPriceSysUsdt6: PriceTickerRequest({
		"ticker/binance.com": ["SYS", "USDT"],
		"ticker/bitget.com": ["SYSUSDT_SPBL"],
		"ticker/digifinex.com": ["sys", "usdt"],
		"ticker#9/gateapi.io": ["sys", "usdt"],
		"ticker/kucoin.com": ["SYS", "USDT"],
		"ticker/mexc.com": ["SYS", "USDT"],
	}),

	WitOracleRequestPriceTusdUsdt6: PriceTickerRequest({
		"ticker/binance.com": ["TUSD", "USDT"],
		"ticker/huobi.pro": ["tusd", "usdt"],
	}),

	WitOracleRequestPriceUniUsd6: PriceTickerRequest({
		"ticker/bitfinex.com": ["uni", "usd"],
		"ticker/bitstamp.net": ["uni", "usd"],
		"ticker/coinbase.com": ["UNI", "USD"],
		"ticker/gemini.com": ["uni", "usd"],
		"ticker/kraken.com": ["UNI", "USD"],
	}),

	WitOracleRequestPriceUsdcUsd6: PriceTickerRequest({
		"ticker/bitstamp.net": ["usdc", "usd"],
		"ticker/gemini.com": ["usdc", "usd"],
		"ticker/kraken.com": ["USDC", "USD"],
	}),

	WitOracleRequestPriceUsdtUsd6: PriceTickerRequest({
		"ticker/kraken.com": ["USDT", "USD"],
		"ticker/binance.us": ["USDT", "USD"],
		"ticker/bitstamp.net": ["usdt", "usd"],
		"ticker/coinbase.com": ["USDT", "USD"],
		"ticker/gemini.com": ["usdt", "usd"],
	}),

	WitOracleRequestPriceWbtcUsd6: PriceTickerRequest({
		"ticker/bitfinex.com": ["wbt", "usd"],
		"ticker/coinbase.com": ["WBTC", "USD"],
		"ticker/kraken.com": ["WBTC", "USD"],
	}),

	WitOracleRequestPriceWitUsdt6: PriceTickerRequest({
		"ticker/hitbtc.com": ["WITUSDT"],
		"ticker/mexc.com": ["WIT", "USDT"],
	}),

	WitOracleRequestPriceWldUsdt6: PriceTickerRequest({
		"ticker/binance.com": ["WLD", "USDT"],
		"ticker/bitget.com": ["WLDUSDT_SPBL"],
		"ticker/bitmart.com": ["WLD", "USDT"],
		"ticker/bybit.com": ["WLD", "USDT", "inverse"],
		"ticker/gateapi.io": ["wld", "usdt"],
		"ticker/kucoin.com": ["WLD", "USDT"],
		"ticker/mexc.com": ["WLD", "USDT"],
		"ticker/okx.com": ["WLD", "USDT"],
	}),

	WitOracleRequestPriceXlmUsd6: PriceTickerRequest({
		"ticker/bitstamp.net": ["xlm", "usd"],
		"ticker/coinbase.com": ["XLM", "USD"],
		"ticker/kraken.com": ["XLM", "USD"],
	}),
};
