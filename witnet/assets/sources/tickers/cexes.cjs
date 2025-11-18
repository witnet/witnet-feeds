const { Witnet } = require("@witnet/sdk");
const { RadonScript, retrievals, types } = Witnet.Radon;
const { RadonBoolean, RadonMap, RadonString } = types;

module.exports = {
	"ticker/aex.zone": retrievals.HttpGet({
		url: "https://api.aex.zone/v2/exchange-rates?currency=\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getMap("data")
			.getMap("rates")
			.getFloat("\\0\\")
			.power(-1)
			.multiply(1e6)
			.round(),
	}),
	"ticker/ascendex.com": retrievals.HttpGet({
		url: "https://ascendex.com/api/pro/v1/spot/ticker?symbol=\\0\\/\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getMap("data")
			.getFloat("close")
			.multiply(1e6)
			.round(),
		samples: {
			// "eos/usd": ["EOS", "USD"],
			"fuse/usdt": ["FUSE", "USDT"],
			// "kcs/usdt": ["KCS", "USDT"],
		},
	}),
	"ticker/bkex.com": retrievals.HttpGet({
		url: "https://api.bkex.com/v2/q/ticker/price?symbol=\\0\\_\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getArray("data")
			.getMap(0)
			.getFloat("price")
			.multiply(1e6)
			.round(),
		samples: {},
	}),
	"ticker/binance.com": retrievals.HttpGet({
		url: "https://api.binance.com/api/v3/ticker/price?symbol=\\0\\\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getFloat("price")
			.multiply(1e6)
			.round(),
		samples: {
			"bnb/usdt": ["BNB", "USDT"],
			"busd/usdt": ["BUSD", "USDT"],
			"cfx/usdt": ["CFX", "USDT"],
			"ftm/usdt": ["FTM", "USDT"],
			"glmr/usdt": ["GLMR", "USDT"],
			"kaia/usdt": ["KAIA", "USDT"],
			"kava/usdt": ["KAVA", "USDT"],
			"op/usdt": ["OP", "USDT"],
			"reef/usdt": ["REEF", "USDT"],
			"sys/usdt": ["SYS", "USDT"],
			"tusd/usdt": ["TUSD", "USDT"],
			"wld/usdt": ["WLD", "USDT"],
		},
	}),
	"ticker/binance.us": retrievals.HttpGet({
		url: "https://api.binance.us/api/v3/ticker/price?symbol=\\0\\\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getFloat("price")
			.multiply(1e6)
			.round(),
		samples: {
			"ape/usd": ["APE", "USD"],
			"avax/usd": ["AVAX", "USD"],
			"bat/usdt": ["BAT", "USDT"],
			"btc/usd": ["BTC", "USD"],
			"celo/usd": ["CELO", "USD"],
			"dai/usd": ["DAI", "USD"],
			"doge/usd": ["DOGE", "USD"],
			"eth/usd": ["ETH", "USD"],
			"pol/usd": ["POL", "USD"],
			usdt: ["USDT", "USD"],
		},
	}),
	"ticker/bitfinex.com": retrievals.HttpGet({
		url: "https://api.bitfinex.com/v1/pubticker/\\0\\\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getFloat("last_price")
			.multiply(1e6)
			.round(),
		samples: {
			"btc/usd": ["btc", "usd"],
			"eos/usd": ["eos", "usd"],
			"eth/usd": ["eth", "usd"],
			"uni/usd": ["uni", "usd"],
			"wbt/usd": ["wbt", "usd"],
		},
	}),
	"ticker/bitfinex.com_v2": retrievals.HttpGet({
		url: "https://api-pub.bitfinex.com/v2/ticker/\\0\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getFloat(0)
			.multiply(1e6)
			.round(),
	}),
	"ticker/bitget.com": retrievals.HttpGet({
		url: "https://api.bitget.com/api/spot/v1/market/ticker?symbol=\\0\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getMap("data")
			.getFloat("close")
			.multiply(1e6)
			.round(),
		samples: {
			"sys/usdt": ["SYSUSDT_SPBL"],
			"wld/usdt": ["WLDUSDT_SPBL"],
		},
	}),
	"ticker/bitget.com_v2": retrievals.HttpGet({
		url: "https://api.bitget.com/api/v2/spot/market/tickers?symbol=\\0\\\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getArray("data")
			.getMap(0)
			.getFloat("lastPr")
			.multiply(1e6)
			.round(),
		samples: {
			"kaia/usdt": ["KAIA", "USDT"],
		},
	}),
	"ticker/bitmart.com": retrievals.HttpGet({
		url: "https://api-cloud.bitmart.com/spot/v1/ticker?symbol=\\0\\_\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getMap("data")
			.getArray("tickers")
			.getMap(0)
			.getFloat("last_price")
			.multiply(1e6)
			.round(),
		samples: {
			"mnt/usdt": ["MNT", "USDT"],
		},
	}),
	"ticker/bitrue.com": retrievals.HttpGet({
		url: "https://openapi.bitrue.com/api/v1/ticker/price?symbol=\\0\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getFloat("price")
			.multiply(1e6)
			.round(),
		samples: {
			"bat/usdt": ["BATUSDT"],
			"reef/usdt": ["REEFUSDT"],
		},
	}),
	"ticker/bitstamp.net": retrievals.HttpGet({
		url: "https://www.bitstamp.net/api/v2/ticker/\\0\\\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getFloat("last")
			.multiply(1e6)
			.round(),
		samples: {
			"ada/usd": ["ada", "usd"],
			"algo/usd": ["algo", "usd"],
			"avax/usd": ["avax", "usd"],
			"btc/usd": ["btc", "usd"],
			"dai/usd": ["dai", "usd"],
			"eth/usd": ["eth", "usd"],
			"link/usd": ["link", "usd"],
			"pol/usd": ["pol", "usd"],
			"uni/usd": ["uni", "usd"],
			"usdc/usd": ["usdc", "usd"],
			"usdt/usd": ["usdt", "usd"],
			"xlm/usd": ["xlm", "usd"],
		},
	}),
	"ticker/bittrex.com": retrievals.HttpGet({
		url: "https://api.bittrex.com/v3/markets/\\0\\-\\1\\/ticker",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getFloat("lastTradeRate")
			.multiply(1e6)
			.round(),
	}),
	"ticker/bitvavo.com": retrievals.HttpGet({
		url: "https://api.bitvavo.com/v2/ticker/price?market=\\0\\-\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getFloat("price")
			.multiply(1e6)
			.round(),
		samples: {
			"celo/eur": ["CELO", "EUR"],
		},
	}),
	"ticker/bybit.com": retrievals.HttpGet({
		url: "https://api.bybit.com/v5/market/tickers?category=\\2\\&symbol=\\0\\\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getMap("result")
			.getArray("list")
			.getMap(0)
			.getFloat("lastPrice")
			.multiply(1e6)
			.round(),
		samples: {
			"bnb/usdt": ["BNB", "USDT", "inverse"],
			"kaia/usdt": ["KAIA", "USDT", "spot"],
			"wld/usdt": ["WLD", "USDT", "inverse"],
		},
	}),
	"ticker/coinbase.com": retrievals.HttpGet({
		url: "https://api.coinbase.com/v2/exchange-rates?currency=\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getMap("data")
			.getMap("rates")
			.getFloat("\\0\\")
			.power(-1)
			.multiply(1e6)
			.round(),
		samples: {
			"ada/usd": ["ADA", "USD"],
			"algo/usd": ["ALGO", "USD"],
			"ape/usd": ["APE", "USD"],
			"atom/usd": ["ATOM", "USD"],
			"avax/usd": ["AVAX", "USD"],
			"bat/usd": ["BAT", "USD"],
			"btc/usd": ["BTC", "USD"],
			"cgld/eur": ["CGLD", "EUR"],
			"cgld/usd": ["CGLD", "USD"],
			"cro/usd": ["CRO", "USD"],
			"dai/usd": ["DAI", "USD"],
			"doge/usd": ["DOGE", "USD"],
			"dot/usd": ["DOT", "USD"],
			"eos/usd": ["EOS", "USD"],
			"eth/usd": ["ETH", "USD"],
			"hkd/usd": ["HKD", "USD"],
			"link/usd": ["LINK", "USD"],
			"matic/usd": ["MATIC", "USD"],
			"sol/usd": ["SOL", "USD"],
			"uni/usd": ["UNI", "USD"],
			"usdt/usd": ["USDT", "USD"],
			"wtbc/usd": ["WBTC", "USD"],
			"xlm/usd": ["XLM", "USD"],
		},
	}),
	"ticker#9/coinbase.com": retrievals.HttpGet({
		url: "https://api.coinbase.com/v2/exchange-rates?currency=\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getMap("data")
			.getMap("rates")
			.getFloat("\\0\\")
			.power(-1)
			.multiply(1e9)
			.round(),
		samples: {
			"shib/usd": ["SHIB", "USD"],
		},
	}),
	"ticker/coinflex.com": retrievals.HttpGet({
		url: "https://v2api.coinflex.com/v3/tickers?marketCode=\\0\\-\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getArray("data")
			.getMap(0)
			.getFloat("markPrice")
			.multiply(1e6)
			.round(),
	}),
	"ticker/coinone.co.kr": retrievals.HttpGet({
		url: "https://api.coinone.co.kr/public/v2/ticker_new/\\0\\/\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getArray("tickers")
			.getMap(0)
			.getFloat("last")
			.multiply(1e3)
			.round(),
		samples: {},
	}),
	"ticker#9/coinyep.com": retrievals.HttpGet({
		url: "https://coinyep.com/api/v1/?from=\\0\\&to=\\1\\&lang=es&format=json",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getFloat("price")
			.multiply(1e9)
			.round(),
	}),
	"ticker/digifinex.com": retrievals.HttpGet({
		url: "https://openapi.digifinex.com/v3/ticker?symbol=\\0\\_\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getArray("ticker")
			.getMap(0)
			.getFloat("last")
			.multiply(1e6)
			.round(),
		samples: {
			"op/usdt": ["op", "usdt"],
			"reef/usdt": ["reef", "usdt"],
			"sys/usdt": ["sys", "usdt"],
		},
	}),
	"ticker#9/freeforexapi.com": retrievals.HttpGet({
		url: "https://www.freeforexapi.com/api/live?pairs=\\0\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getMap("rates")
			.getMap("\\0\\")
			.getFloat("rate")
			.power(-1)
			.multiply(1e9)
			.round(),
	}),
	"ticker/gateapi.io": retrievals.HttpGet({
		url: "https://data.gateapi.io/api2/1/ticker/\\0\\_\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getFloat("last")
			.multiply(1e6)
			.round(),
		samples: {
			"bnb/usdt": ["bnb", "usdt"],
			"boba/usdt": ["boba", "usdt"],
			"cfx/usdt": ["cfx", "usdt"],
			"cro/usdt": ["cro", "usdt"],
			"dai/usdt": ["dai", "usdt"],
			"ela/usdt": ["ela", "usdt"],
			"elon/usdt": ["elon", "usdt"],
			"frax/usdt": ["frax", "usdt"],
			"ftm/usdt": ["ftm", "usdt"],
			"fuse/usdt": ["fuse", "usdt"],
			"glmr/usdt": ["glmr", "usdt"],
			"ht/usdt": ["ht", "usdt"],
			"kaia/usdt": ["kaia", "usdt"],
			"kava/usdt": ["kava", "usdt"],
			"metis/usdt": ["metis", "usdt"],
			"mnt/usdt": ["mnt", "usdt"],
			"mtrg/usdt": ["mtrg", "usdt"],
			"okb/usdt": ["okb", "usdt"],
			"okt/usdt": ["okt", "usdt"],
			"op/usdt": ["op", "usdt"],
			"reef/usdt": ["reef", "usdt"],
			"shib/usdt": ["shib", "usdt"],
			"sys/usdt": ["sys", "usdt"],
			"wit/usdt": ["wit", "usdt"],
			"wld/usdt": ["wld", "usdt"],
		},
	}),
	"ticker#9/gateapi.io": retrievals.HttpGet({
		url: "https://data.gateapi.io/api2/1/ticker/\\0\\_\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getFloat("last")
			.multiply(1e9)
			.round(),
	}),
	"ticker#9/exchangerate.host": retrievals.HttpGet({
		url: "https://api.exchangerate.host/latest?base=\\0\\&symbol=\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getMap("rates")
			.getFloat("\\1\\")
			.multiply(1e9)
			.round(),
	}),
	"ticker#9/fastforex.io": retrievals.HttpGet({
		url: "https://api.fastforex.io/fetch-one?from=\\0\\&to=\\1\\&api_key=demo",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getMap("result")
			.getFloat("\\1\\")
			.multiply(1e9)
			.round(),
	}),
	"ticker/gemini.com": retrievals.HttpGet({
		url: "https://api.gemini.com/v1/pubticker/\\0\\\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getFloat("last")
			.multiply(1e6)
			.round(),
		samples: {
			"avax/usd": ["avax", "usd"],
			"btc/usd": ["btc", "usd"],
			"dai/usd": ["dai", "usd"],
			"eth/usd": ["eth", "usd"],
			"uni/usd": ["uni", "usd"],
			"usdc/usd": ["usdc", "usd"],
			"usdt/usd": ["usdt", "usd"],
		},
	}),
	"ticker/hitbtc.com": retrievals.HttpGet({
		url: "https://api.hitbtc.com/api/3/public/ticker?symbols=\\0\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getMap("\\0\\")
			.getFloat("last")
			.multiply(1e6)
			.round(),
		samples: {
			"reef/usdt": ["REEFUSDT"],
			"wit/usdt": ["WITUSDT"],
		},
	}),
	"ticker/hotbit.io": retrievals.HttpGet({
		url: "https://api.hotbit.io/api/v1/market.last?market=\\0\\\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getFloat("result")
			.multiply(1e6)
			.round(),
	}),
	"ticker/huobi.pro": retrievals.HttpGet({
		url: "https://api.huobi.pro/market/detail/merged?symbol=\\0\\\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getMap("tick")
			.getFloat("close")
			.multiply(1e6)
			.round(),
		samples: {
			"bnb/usdt": ["bnb", "usdt"],
			"boba/usdt": ["boba", "usdt"],
			"ela/usdt": ["ela", "usdt"],
			"elon/usdt": ["elon", "usdt"],
			"fuse/usdt": ["fuse", "usdt"],
			"kava/usdt": ["kava", "usdt"],
			"tusd/usdt": ["tusd", "usdt"],
		},
	}),
	"ticker#9/huobi.pro": retrievals.HttpGet({
		url: "https://api.huobi.pro/market/detail/merged?symbol=\\0\\\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getMap("tick")
			.getFloat("close")
			.multiply(1e6)
			.round(),
	}),
	"ticker/indoex.io": retrievals.HttpGet({
		url: "https://api.indoex.io/getSelectedMarket/\\0\\_\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getArray("marketdetails")
			.getMap(0)
			.getFloat("last")
			.multiply(1e6)
			.round(),
	}),
	"ticker#9/jsdelivr.net": retrievals.HttpGet({
		url: "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/\\0\\.json",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getMap("\\0\\")
			.getFloat("\\1\\")
			.multiply(1e9)
			.round(),
	}),
	"ticker/killswitch.finance": retrievals.HttpGet({
		url: "https://api.killswitch.finance/ksw2/prices?chain=56",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getFloat("\\0\\")
			.multiply(1e6)
			.round(),
	}),
	"ticker/korbit.co.kr": retrievals.HttpGet({
		url: "https://api.korbit.co.kr/v1/ticker/detailed?currency_pair=\\0\\_\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getFloat("last")
			.multiply(1e3)
			.round(),
	}),
	"ticker/kraken.com": retrievals.HttpGet({
		url: "https://api.kraken.com/0/public/Ticker?pair=\\0\\\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getMap("result")
			.values()
			.getMap(0)
			.getArray("a")
			.getFloat(0)
			.multiply(1e6)
			.round(),
		samples: {
			"ada/usd": ["ADA", "USD"],
			"algo/usd": ["ALGO", "USD"],
			"ape/usd": ["APE", "USD"],
			"atom/usd": ["ATOM", "USD"],
			"avax/usd": ["AVAX", "USD"],
			"btc/usd": ["BTC", "USD"],
			"dai/usd": ["DAI", "USD"],
			"doge/usd": ["DOGE", "USD"],
			"dot/usd": ["DOT", "USD"],
			"eth/usd": ["ETH", "USD"],
			"link/usd": ["LINK", "USD"],
			"pol/usd": ["POL", "USD"],
			"shib/usd": ["SHIB", "USD"],
			"sol/usd": ["SOL", "USD"],
			"uni/usd": ["UNI", "USD"],
			"usdc/usd": ["USDC", "USD"],
			"usdt/usd": ["USDT", "USD"],
			"wbtc/usd": ["WBTC", "USD"],
			"xlm/usd": ["XLM", "USD"],
		},
	}),
	"ticker#9/kraken.com": retrievals.HttpGet({
		url: "https://api.kraken.com/0/public/Ticker?pair=\\0\\\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getMap("result")
			.values()
			.getMap(0)
			.getArray("a")
			.getFloat(0)
			.multiply(1e9)
			.round(),
	}),
	"ticker/kucoin.com": retrievals.HttpGet({
		url: "https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=\\0\\-\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getMap("data")
			.getFloat("price")
			.multiply(1e6)
			.round(),
		samples: {
			"mtrg/ust": ["MTRG", "USDT"],
		},
	}),
	"ticker#9/kucoin.com": retrievals.HttpGet({
		url: "https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=\\0\\-\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getMap("data")
			.getFloat("price")
			.multiply(1e9)
			.round(),
		samples: {
			"bnb/usdt": ["BNB", "USDT"],
			"cfx/usdt": ["CFX", "USDT"],
			"cro/usdt": ["CRO", "USDT"],
			"ela/usdt": ["ELA", "USDT"],
			"elon/usdt": ["ELON", "USDT"],
			"glmr/usdt": ["GLMR", "USDT"],
			"kava/usdt": ["KAVA", "USDT"],
			"kcs/usdt": ["KCS", "USDT"],
			"metis/usdt": ["METIS", "USDT"],
			"mtrg/usdt": ["MTRG", "USDT"],
			"op/usdt": ["OP", "USDT"],
			"reef/usdt": ["REEF", "USDT"],
			"sys/usdt": ["SYS", "USDT"],
			"wld/usdt": ["WLD", "USDT"],
		},
	}),
	"ticker#9/live-rates.com": retrievals.HttpGet({
		url: "https://www.live-rates.com/rates",
		script: RadonScript(RadonString)
			.parseJSONArray()
			.filter(
				RadonScript(RadonMap)
					.getString("currency")
					.match(RadonBoolean, { "\\1\\/\\0\\": true }, false),
			)
			.getMap(0)
			.getFloat("rate")
			.power(-1)
			.multiply(1e9)
			.round(),
	}),
	"ticker/mastercard.us": retrievals.HttpGet({
		url: "https://www.mastercard.us/settlement/currencyrate/conversion-rate?fxDate=0000-00-00&transCurr=\\0\\&crdhldBillCurr=\\1\\&bankFee=0&transAmt=1",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getMap("data")
			.getFloat("conversionRate")
			.multiply(1e6)
			.round(),
	}),
	"ticker#9/mastercard.us": retrievals.HttpGet({
		url: "https://www.mastercard.us/settlement/currencyrate/conversion-rate?fxDate=0000-00-00&transCurr=\\0\\&crdhldBillCurr=\\1\\&bankFee=0&transAmt=1",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getMap("data")
			.getFloat("conversionRate")
			.multiply(1e9)
			.round(),
	}),
	"ticker#9/messari.io": retrievals.HttpGet({
		url: "https://data.messari.io/api/v1/assets/\\0\\/metrics/market-data?fields=market_data/price_\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getMap("data")
			.getMap("market_data")
			.getFloat("price_\\1\\")
			.multiply(1e9)
			.round(),
	}),
	"ticker/mexc.com": retrievals.HttpGet({
		url: "https://api.mexc.com/api/v3/ticker/price?symbol=\\0\\\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getFloat("price")
			.multiply(1e6)
			.round(),
		samples: {
			"boba/usdt": ["BOBA", "USDT"],
			"cfx/usdt": ["CFX", "USDT"],
			"cro/usdt": ["CRO", "USDT"],
			"elon/usdt": ["ELON", "USDT"],
			"fuse/usdt": ["FUSE", "USDT"],
			"glmr/usdt": ["GLMR", "USDT"],
			"kava/usdt": ["KAVA", "USDT"],
			"kcs/usdt": ["KCS", "USDT"],
			"metis/usdt": ["METIS", "USDT"],
			"okb/usdt": ["OKB", "USDT"],
			"sys/usdt": ["SYS", "USDT"],
			"wit/usdt": ["WIT", "USDT"],
			"wld/usdt": ["WLD", "USDT"],
		},
	}),
	"ticker/mexc.com/v3": retrievals.HttpGet({
		url: "https://api.mexc.com/api/v3/ticker/price?symbol=\\0\\\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getFloat("price")
			.multiply(1e6)
			.round(),
		samples: {
			"mnt/usdt": ["MNT", "USDT"],
			"mtrg/usdt": ["MTRG", "USDT"],
		},
	}),
	"ticker#9/mexc.com": retrievals.HttpGet({
		url: "https://www.mexc.com/open/api/v2/market/ticker?symbol=\\0\\_\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getArray("data")
			.getMap(0)
			.getFloat("last")
			.multiply(1e9)
			.round(),
	}),
	"ticker/okcoin.com": retrievals.HttpGet({
		url: "https://www.okcoin.com/api/spot/v3/instruments/\\0\\-\\1\\/ticker",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getFloat("last")
			.multiply(1e6)
			.round(),
	}),
	"ticker/okx.com": retrievals.HttpGet({
		url: "https://www.okx.com/api/v5/market/ticker?instId=\\0\\-\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getArray("data")
			.getMap(0)
			.getFloat("last")
			.multiply(1e6)
			.round(),
	}),
	"ticker#9/okx.com": retrievals.HttpGet({
		url: "https://www.okx.com/api/v5/market/ticker?instId=\\0\\-\\1\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getArray("data")
			.getMap(0)
			.getFloat("last")
			.multiply(1e9)
			.round(),
		samples: {
			"bat/usdt": ["BAT", "USDT"],
			"bnb/usdt": ["BNB", "USDT"],
			"celo/usdt": ["CELO", "USDT"],
			"cfx/usdt": ["CFX", "USDT"],
			"cro/usdt": ["CRO", "USDT"],
			"elon/usdt": ["ELON", "USDT"],
			"kaia/usdt": ["KAIA", "USDT"],
			"okb/usdt": ["OKB", "USDT"],
			"op/usdt": ["OP", "USDT"],
			"wld/usdt": ["WLD", "USDT"],
		},
	}),
	"ticker/pancakeswap.info": retrievals.HttpGet({
		url: "https://api.pancakeswap.info/api/v2/tokens/\\0\\",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getMap("data")
			.getFloat("price")
			.multiply(1e6)
			.round(),
	}),
	"ticker/revolut.com": retrievals.HttpGet({
		url: "https://www.revolut.com/api/exchange/quote?amount=1&country=\\2\\&fromCurrency=\\0\\&isRecipientAmount=false&toCurrency=\\1\\",
		headers: {
			"Accept-language": "en",
		},
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getMap("rate")
			.getFloat("rate")
			.multiply(1e6)
			.round(),
		samples: {
			"hkd/usd": ["HKD", "USD", "US"],
			"krw/usd": ["KRW", "USD", "KR"],
		},
	}),
	"ticker#9/revolut.com": retrievals.HttpGet({
		url: "https://www.revolut.com/api/exchange/quote?amount=1&country=\\2\\&fromCurrency=\\0\\&isRecipientAmount=false&toCurrency=\\1\\",
		headers: {
			"Accept-language": "en",
		},
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getMap("rate")
			.getFloat("rate")
			.multiply(1e9)
			.round(),
	}),
	"ticker/upbit.com": retrievals.HttpGet({
		url: "https://api.upbit.com/v1/ticker?markets=\\1\\-\\0\\",
		script: RadonScript(RadonString)
			.parseJSONArray()
			.getMap(0)
			.getFloat("trade_price")
			.multiply(1e6)
			.round(),
		samples: {
			"bat/usdt": ["BAT", "USDT"],
		},
	}),
	"ticker/xt.pub": retrievals.HttpGet({
		url: "https://www.xt.pub/exchange/api/markets/returnTicker",
		script: RadonScript(RadonString)
			.parseJSONMap()
			.getMap("\\0\\_\\1\\")
			.getFloat("last")
			.multiply(1e6)
			.round(),
	}),
};
