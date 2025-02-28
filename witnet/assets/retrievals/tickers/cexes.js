const { utils, Witnet } = require("witnet-solidity")
const { legacy } = require("witnet-solidity/assets")

module.exports = {
    "ticker/aex.zone": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.aex.zone/v2/exchange-rates?currency=\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString)
            .parseJSONMap()
            .getMap("data")
            .getMap("rates")
            .getFloat("\\0\\")
            .power(-1)
            .multiply(1e6)
            .round(),
    }),
    "ticker/ascendex.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://ascendex.com/api/pro/v1/spot/ticker?symbol=\\0\\/\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString)
            .parseJSONMap()
            .getMap("data")
            .getFloat("close")
            .multiply(1e6)
            .round(),
        samples: {
            "eos/usd": ["EOS", "USD"],
            "fuse/usdt": ["FUSE", "USDT"],
            "kcs/usdt": ["KCS", "USDT"],
        },
    }),
    "ticker/bkex.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.bkex.com/v2/q/ticker/price?symbol=\\0\\_\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getArray("data").getMap(0).getFloat("price").multiply(1e6).round(),
        // samples: {
        //     "op/usdt": [ "OP", "USDT" ],
        //     "reef/usdt": [ "REEF", "USDT" ],
        //     "sys/usdt": [ "SYS", "USDT" ],
        // },
    }),
    "ticker/binance.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.binance.com/api/v3/ticker/price?symbol=\\0\\\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getFloat("price").multiply(1e6).round(),
        samples: {
            "bnb/usdt":  ["BNB", "USDT"],
            "busd/usdt": ["BUSD", "USDT"],
            "cfx/usdt":  ["CFX", "USDT"],
            "ftm/usdt":  ["FTM", "USDT"],
            "glmr/usdt": ["GLMR", "USDT"],
            "kaia/usdt": ["KAIA", "USDT"],
            "kava/usdt": ["KAVA", "USDT"],
            "op/usdt":   ["OP", "USDT"],
            "reef/usdt": ["REEF", "USDT"],
            "sys/usdt":  ["SYS", "USDT"],
            "tusd/usdt": ["TUSD", "USDT"],
            "wld/usdt":  ["WLD", "USDT"],
        }
    }),
    "ticker/binance.us": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.binance.us/api/v3/ticker/price?symbol=\\0\\\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getFloat("price").multiply(1e6).round(),
        samples: {
            "ape/usd":   ["APE", "USD"],
            "avax/usd":  ["AVAX", "USD"],
            "bat/usdt":  ["BAT", "USDT"],
            "btc/usd":   ["BTC", "USD"],
            "celo/usd":  ["CELO", "USD"],
            "dai/usd":   ["DAI", "USD"],
            "doge/usd":  ["DOGE", "USD"],
            "eth/usd":   ["ETH", "USD"],
            "matic/usd": ["MATIC", "USD"],
            "usdt":      ["USDT", "USD"],
        },
    }),
    "ticker/bitfinex.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.bitfinex.com/v1/pubticker/\\0\\\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getFloat("last_price").multiply(1e6).round(),
        samples: {
            "btc/usd": ["btc", "usd"],
            "eos/usd": ["eos", "usd"],
            "eth/usd": ["eth", "usd"],
            "uni/usd": ["uni", "usd"],
            "wbt/usd": ["wbt", "usd"],
        }
    }),
    "ticker/bitfinex.com#v2": Witnet.RadonRetrievals.HttpGet({
        url: "https://api-pub.bitfinex.com/v2/ticker/\\0\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getFloat(0).multiply(1e6).round(),
    }),
    "ticker/bitget.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.bitget.com/api/spot/v1/market/ticker?symbol=\\0\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("data").getFloat("close").multiply(1e6).round(),
        samples: { 
            "sys/usdt": [ "SYSUSDT_SPBL" ], 
            "wld/usdt": [ "WLDUSDT_SPBL" ],
        },
    }),
    "ticker/bitget.com#v2": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.bitget.com/api/v2/spot/market/tickers?symbol=\\0\\\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getArray("data").getMap(0).getFloat("lastPr").multiply(1e6).round(),
        samples: { 
            "kaia/usdt": [ "KAIA", "USDT", ], 
        },
    }),
    "ticker/bitmart.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://api-cloud.bitmart.com/spot/v1/ticker?symbol=\\0\\_\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("data").getArray("tickers").getMap(0).getFloat("last_price").multiply(1e6).round(),
        samples :{
            "mnt/usdt": [ "MNT", "USDT" ],
            "wit/usdt": [ "WIT", "USDT" ],
            "wld/usdt": [ "WLD", "USDT" ],
        },
    }),
    "ticker/bitrue.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://openapi.bitrue.com/api/v1/ticker/price?symbol=\\0\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getFloat("price").multiply(1e6).round(),
        samples: {
            "bat/usdt":  [ "BATUSDT" ],
            "reef/usdt": [ "REEFUSDT" ],
        },
    }),
    "ticker/bitstamp.net": Witnet.RadonRetrievals.HttpGet({
        url: "https://www.bitstamp.net/api/v2/ticker/\\0\\\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getFloat("last").multiply(1e6).round(),
        samples: {
            "ada/usd": [ "ada", "usd" ],
            "algo/usd": [ "algo", "usd" ],
            "avax/usd": [ "avax", "usd" ],
            "btc/usd": [ "btc", "usd" ],
            "dai/usd": [ "dai", "usd" ],
            "eth/usd": [ "eth", "usd" ],
            "link/usd": [ "link", "usd" ],
            "matic/usd": [ "matic", "usd" ],
            "uni/usd": [ "uni", "usd" ],
            "usdc/usd": [ "usdc", "usd" ],
            "usdt/usd": [ "usdt", "usd" ],
            "xlm/usd": [ "xlm", "usd" ],
        },
    }),
    "ticker/bittrex.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.bittrex.com/v3/markets/\\0\\-\\1\\/ticker",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getFloat("lastTradeRate").multiply(1e6).round(),
        samples: {
            "dot/usd": [ "DOT", "USD" ],
        },
    }),
    "ticker/bitvavo.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.bitvavo.com/v2/ticker/price?market=\\0\\-\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getFloat("price").multiply(1e6).round(),
        samples: {
            "celo/eur": [ "CELO", "EUR" ],
        },
    }),
    "ticker/bybit.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.bybit.com/v5/market/tickers?category=\\2\\&symbol=\\0\\\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("result").getArray("list").getMap(0).getFloat("lastPrice").multiply(1e6).round(),
        samples: {
            "bnb/usdt":  [ "BNB", "USDT", "inverse" ],
            "ftm/usdt":  [ "FTM", "USDT", "inverse" ],
            "kaia/usdt": [ "KAIA", "USDT", "spot" ],
            "wld/usdt":  [ "WLD", "USDT", "inverse" ],
        },
    }),
    "ticker/coinbase.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.coinbase.com/v2/exchange-rates?currency=\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("data").getMap("rates").getFloat("\\0\\").power(-1).multiply(1e6).round(),
        samples: {
            "ada/usd": [ "ADA", "USD" ],
            "algo/usd": [ "ALGO", "USD" ],
            "ape/usd": [ "APE", "USD" ],
            "atom/usd": [ "ATOM", "USD" ],
            "avax/usd": [ "AVAX", "USD" ],
            "bat/usd": [ "BAT", "USD" ],
            "btc/usd": [ "BTC", "USD" ],
            "cgld/eur": [ "CGLD", "EUR" ],
            "cgld/usd": [ "CGLD", "USD" ],
            "cro/usd": [ "CRO", "USD" ],
            "dai/usd": [ "DAI", "USD" ],
            "doge/usd": [ "DOGE", "USD" ],
            "dot/usd": [ "DOT", "USD" ],
            "eos/usd": [ "EOS", "USD" ],
            "eth/usd": [ "ETH", "USD" ],
            "hkd/usd": [ "HKD", "USD" ],
            "link/usd": [ "LINK", "USD" ],
            "matic/usd": [ "MATIC", "USD" ],
            "sol/usd": [ "SOL", "USD" ],
            "uni/usd": [ "UNI", "USD" ],
            "usdt/usd": [ "USDT", "USD" ],
            "wtbc/usd": [ "WBTC", "USD" ],
            "xlm/usd": [ "XLM", "USD" ],
        },
    }),
    "ticker/coinbase.com#9": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.coinbase.com/v2/exchange-rates?currency=\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("data").getMap("rates").getFloat("\\0\\").power(-1).multiply(1e9).round(),
        samples: {
            "shib/usd": [ "SHIB", "USD" ],
        },
    }),
    "ticker/coinflex.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://v2api.coinflex.com/v3/tickers?marketCode=\\0\\-\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getArray("data").getMap(0).getFloat("markPrice").multiply(1e6).round(),
    }),
    "ticker/coinone.co.kr": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.coinone.co.kr/public/v2/ticker_new/\\0\\/\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getArray("tickers").getMap(0).getFloat("last").multiply(1e3).round(),
        samples: {
            "krw/ksp": [ "krw", "ksp" ],
        },
    }),
    "ticker/coinyep.com#9": Witnet.RadonRetrievals.HttpGet({
        url: "https://coinyep.com/api/v1/?from=\\0\\&to=\\1\\&lang=es&format=json",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getFloat("price").multiply(1e9).round(),
    }),
    "ticker/digifinex.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://openapi.digifinex.com/v3/ticker?symbol=\\0\\_\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getArray("ticker").getMap(0).getFloat("last").multiply(1e6).round(),
        samples: {
            "ftm/usdt": [ "ftm", "usdt" ],
            "op/usdt":  [ "op", "usdt" ],
            "reef/usdt": [ "reef", "usdt" ],
            "sys/usdt": [ "sys", "usdt" ],
        },
    }),
    "ticker/freeforexapi.com#9": Witnet.RadonRetrievals.HttpGet({
        url: "https://www.freeforexapi.com/api/live?pairs=\\0\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("rates").getMap("\\0\\").getFloat("rate").power(-1).multiply(1e9).round(),
    }),
    "ticker/gateapi.io": Witnet.RadonRetrievals.HttpGet({
        url: "https://data.gateapi.io/api2/1/ticker/\\0\\_\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getFloat("last").multiply(1e6).round(),
        samples: {
            "bnb/usdt": [ "bnb", "usdt" ],
            "boba/usdt": [ "boba", "usdt" ],
            "boring/usdt": [ "boring", "usdt" ],
            "cfx/usdt": [ "cfx", "usdt" ],
            "cro/usdt": [ "cro", "usdt" ],
            "dai/usdt": [ "dai", "usdt" ],
            "ela/usdt": [ "ela", "usdt" ],
            "elon/usdt": [ "elon", "usdt" ],
            "frax/usdt": [ "frax", "usdt" ],
            "ftm/usdt": [ "ftm", "usdt" ],
            "fuse/usdt": [ "fuse", "usdt" ],
            "glmr/usdt": [ "glmr", "usdt" ],
            "ht/usdt": [ "ht", "usdt" ],
            "kaia/usdt": [ "kaia", "usdt" ],
            "kava/usdt": [ "kava", "usdt" ],
            "metis/usdt": [ "metis", "usdt" ],
            "mnt/usdt": [ "mnt", "usdt" ],
            "mtrg/usdt": [ "mtrg", "usdt" ],
            "okb/usdt": [ "okb", "usdt" ],
            "okt/usdt": [ "okt", "usdt" ],
            "op/usdt": [ "op", "usdt" ],
            "reef/usdt": [ "reef", "usdt" ],
            "shib/usdt": [ "shib", "usdt" ],
            "sys/usdt": [ "sys", "usdt" ],
            "wit/usdt": [ "wit", "usdt" ],
            "wld/usdt": [ "wld", "usdt" ],
        },
    }),
    "ticker/gateapi.io#9": Witnet.RadonRetrievals.HttpGet({
        url: "https://data.gateapi.io/api2/1/ticker/\\0\\_\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getFloat("last").multiply(1e9).round(),
    }),
    "ticker/exchangerate.host#9": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.exchangerate.host/latest?base=\\0\\&symbol=\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("rates").getFloat("\\1\\").multiply(1e9).round(),
        samples: { 
            "krw/usd": [ "KRW", "USD" ] 
        },
    }),
    "ticker/fastforex.io#9": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.fastforex.io/fetch-one?from=\\0\\&to=\\1\\&api_key=demo",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("result").getFloat("\\1\\").multiply(1e9).round(),
        samples: { 
            "krw/usd": [ "KRW", "USD" ] 
        },
    }),
    "ticker/gemini.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.gemini.com/v1/pubticker/\\0\\\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getFloat("last").multiply(1e6).round(),
        samples: { 
            "avax/usd": [ "avax", "usd" ],
            "btc/usd": [ "btc", "usd" ],
            "dai/usd": [ "dai", "usd" ],
            "eth/usd": [ "eth", "usd" ],
            "uni/usd": [ "uni", "usd" ],
            "usdc/usd": [ "usdc", "usd" ],
            "usdt/usd": [ "usdt", "usd" ],
        },
    }),
    "ticker/hitbtc.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.hitbtc.com/api/3/public/ticker?symbols=\\0\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("\\0\\").getFloat("last").multiply(1e6).round(),
        samples: { 
            "reef/usdt": [ "REEFUSDT" ] 
        },
    }),
    "ticker/hotbit.io": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.hotbit.io/api/v1/market.last?market=\\0\\\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getFloat("result").multiply(1e6).round(),
        samples: { 
            "glmr/usdt": [ "GLMR", "USDT" ],
            "metis/usdt": [ "METIS", "USDT" ],
        },
    }),
    "ticker/huobi.pro": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.huobi.pro/market/detail/merged?symbol=\\0\\\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("tick").getFloat("close").multiply(1e6).round(),
        samples: {
            "bnb/usdt": [ "bnb", "usdt" ],
            "boba/usdt": [ "boba", "usdt" ],
            "boring/usdt": [ "boring", "usdt" ],
            "cube/usdt": [ "cube", "usdt" ],
            "ela/usdt": [ "ela", "usdt" ],
            "elon/usdt": [ "elon", "usdt" ],
            "ftm/usdt": [ "ftm", "usdt" ],
            "fuse/usdt": [ "fuse", "usdt" ],
            "kava/usdt": [ "kava", "usdt" ],
            "tusd/usdt": [ "tusd", "usdt" ],
        },
    }),
    "ticker/huobi.pro#9": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.huobi.pro/market/detail/merged?symbol=\\0\\\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("tick").getFloat("close").multiply(1e6).round(),
        // samples: {
        //     "BNB/USDT-9": [ "bnb", "usdt" ],
        //     "BOBA/USDT-9": [ "boba", "usdt" ],
        //     "BORING/USDT-9": [ "boring", "usdt" ],
        //     "CUBE/USDT-9": [ "cube", "usdt" ],
        //     "ELON/USDT-9": [ "elon", "usdt" ],
        //     "FTM/USDT-9": [ "ftm", "usdt" ],
        //     "KAVA/USDT-9": [ "kava", "usdt" ],
        // },
    }),
    "ticker/indoex.io": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.indoex.io/getSelectedMarket/\\0\\_\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getArray("marketdetails").getMap(0).getFloat("last").multiply(1e6).round(),
        samples: { 
            "busd/usdt": [ "BUSD", "USDT", ]
        },
    }),
    "ticker/jsdelivr.net#9": Witnet.RadonRetrievals.HttpGet({
        url: "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/\\0\\.json",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("\\0\\").getFloat("\\1\\").multiply(1e9).round(),
    }),
    "ticker/killswitch.finance": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.killswitch.finance/ksw2/prices?chain=56",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getFloat("\\0\\").multiply(1e6).round(),
    }),
    "ticker/korbit.co.kr": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.korbit.co.kr/v1/ticker/detailed?currency_pair=\\0\\_\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getFloat("last").multiply(1e3).round(),
        samples: {
            "ksp/krw": [ "ksp", "krw" ],
        },
    }),
    "ticker/kraken.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.kraken.com/0/public/Ticker?pair=\\0\\\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("result").values().getMap(0).getArray("a").getFloat(0).multiply(1e6).round(),
        samples: {
            "ada/usd": [ "ADA", "USD" ],
            "algo/usd": [ "ALGO", "USD" ],
            "ape/usd": [ "APE", "USD" ],
            "atom/usd": [ "ATOM", "USD" ],
            "avax/usd": [ "AVAX", "USD" ],
            "btc/usd": [ "BTC", "USD" ],
            "dai/usd": [ "DAI", "USD" ],
            "doge/usd": [ "DOGE", "USD" ],
            "dot/usd": [ "DOT", "USD" ],
            "eos/usd": [ "EOS", "USD" ],
            "eth/usd": [ "ETH", "USD" ],
            "link/usd": [ "LINK", "USD" ],
            "matic/usd": [ "MATIC", "USD" ],
            "shib/usd": [ "SHIB", "USD" ],
            "sol/usd": [ "SOL", "USD" ],
            "uni/usd": [ "UNI", "USD" ],
            "usdc/usd": [ "USDC", "USD" ],
            "usdt/usd": [ "USDT", "USD" ],
            "wbtc/usd": [ "WBTC", "USD" ],
            "xlm/usd": [ "XLM", "USD" ],
        }
    }),
    "ticker/kraken.com#9": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.kraken.com/0/public/Ticker?pair=\\0\\\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("result").values().getMap(0).getArray("a").getFloat(0).multiply(1e9).round(),
    }),
    "ticker/kucoin.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=\\0\\-\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("data").getFloat("price").multiply(1e6).round(),
    }),
    "ticker/kucoin.com#9": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=\\0\\-\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("data").getFloat("price").multiply(1e9).round(),
        samples: {
            "bnb/usdt": [ "BNB", "USDT" ],
            "cfx/usdt": [ "CFX", "USDT" ],
            "cro/usdt": [ "CRO", "USDT" ],
            "ela/usdt": [ "ELA", "USDT" ],
            "elon/usdt": [ "ELON", "USDT" ],
            "ftm/usdt": [ "FTM", "USDT" ],
            "glmr/usdt": [ "GLMR", "USDT" ],
            "kava/usdt": [ "KAVA", "USDT" ],
            "kcs/usdt": [ "KCS", "USDT" ],
            "metis/usdt": [ "METIS", "USDT" ],
            "mtrg/usdt": [ "MTRG", "USDT" ],
            "op/usdt": [ "OP", "USDT" ],
            "reef/usdt": [ "REEF", "USDT" ],
            "sys/usdt": [ "SYS", "USDT" ],
            "wld/usdt": [ "WLD", "USDT" ],
        },
    }),
    "ticker/live-rates.com#9": Witnet.RadonRetrievals.HttpGet({
        url: "https://www.live-rates.com/rates",
        script: Witnet.RadonScript(Witnet.RadonString)
            .parseJSONArray()
            .filter(
                Witnet.RadonScript(Witnet.RadonMap).getString("currency").match(
                    Witnet.RadonBoolean,
                    { "\\1\\/\\0\\": true }, 
                    false
                )
            ).getMap(0).getFloat("rate").power(-1).multiply(1e9).round()
    }),
    "ticker/mastercard.us": Witnet.RadonRetrievals.HttpGet({
        url: "https://www.mastercard.us/settlement/currencyrate/conversion-rate?fxDate=0000-00-00&transCurr=\\0\\&crdhldBillCurr=\\1\\&bankFee=0&transAmt=1",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("data").getFloat("conversionRate").multiply(1e6).round(),
        samples: {
            "hkd/usd": [ "HKD", "USD" ],
            "krw/usd": [ "KRW", "USD" ],
        },
    }),
    "ticker/mastercard.us#9": Witnet.RadonRetrievals.HttpGet({
        url: "https://www.mastercard.us/settlement/currencyrate/conversion-rate?fxDate=0000-00-00&transCurr=\\0\\&crdhldBillCurr=\\1\\&bankFee=0&transAmt=1",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("data").getFloat("conversionRate").multiply(1e9).round(),
    }),
    "ticker/messari.io#9": Witnet.RadonRetrievals.HttpGet({
        url: "https://data.messari.io/api/v1/assets/\\0\\/metrics/market-data?fields=market_data/price_\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("data").getMap("market_data").getFloat("price_\\1\\").multiply(1e9).round(),

    }),
    "ticker/mexc.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://www.mexc.com/open/api/v2/market/ticker?symbol=\\0\\_\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getArray("data").getMap(0).getFloat("last").multiply(1e6).round(),
        samples: {
            "boba/usdt": [ "BOBA", "USDT" ],
            "boring/usdt": [ "BORING", "USDT" ],
            "cfx/usdt": [ "CFX", "USDT" ],
            "cro/usdt": [ "CRO", "USDT" ],
            "elon/usdt": [ "ELON", "USDT" ],
            "ftm/usdt": [ "FTM", "USDT" ],
            "fuse/usdt": [ "FUSE", "USDT" ],
            "glmr/usdt": [ "GLMR", "USDT" ],
            "kava/usdt": [ "KAVA", "USDT" ],
            "kcs/usdt": [ "KCS", "USDT" ],
            "metis/usdt": [ "METIS", "USDT" ],
            "mnt/usdt": [ "MNT", "USDT" ],
            "mtr/usdt": [ "MTR", "USDT" ],
            "mtrg/usdt": [ "MTRG", "USDT" ],
            "okb/usdt": [ "OKB", "USDT" ],
            "okt/usdt": [ "OKT", "USDT" ],
            "sys/usdt": [ "SYS", "USDT" ],
            "wit/usdt": [ "WIT", "USDT" ],
            "wld/usdt": [ "WLD", "USDT" ],
        },
    }),
    "ticker/mexc.com#9": Witnet.RadonRetrievals.HttpGet({
        url: "https://www.mexc.com/open/api/v2/market/ticker?symbol=\\0\\_\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getArray("data").getMap(0).getFloat("last").multiply(1e9).round(),
    }),
    "ticker/okcoin.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://www.okcoin.com/api/spot/v3/instruments/\\0\\-\\1\\/ticker",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getFloat("last").multiply(1e6).round(),
    }),
    "ticker/okx.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://www.okx.com/api/v5/market/ticker?instId=\\0\\-\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getArray("data").getMap(0).getFloat("last").multiply(1e6).round(),
    }),
    "ticker/okx.com#9": Witnet.RadonRetrievals.HttpGet({
        url: "https://www.okx.com/api/v5/market/ticker?instId=\\0\\-\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getArray("data").getMap(0).getFloat("last").multiply(1e9).round(),
        samples: {
            "bat/usdt": [ "BAT", "USDT" ],
            "bnb/usdt": [ "BNB", "USDT" ],
            "boring/usdt": [ "BORING", "USDT" ],
            "celo/usdt": [ "CELO", "USDT" ],
            "cfx/usdt": [ "CFX", "USDT" ],
            "cro/usdt": [ "CRO", "USDT" ],
            "elon/usdt": [ "ELON", "USDT" ],
            "ftm/usdt": [ "FTM", "USDT" ],
            "glmr/usdt": [ "GLMR", "USDT" ],
            "kaia/usdt": [ "KAIA", "USDT" ],
            "okb/usdt": [ "OKB", "USDT" ],
            "okt/usdt": [ "OKT", "USDT" ],
            "op/usdt": [ "OP", "USDT" ],
            "wld/usdt": [ "WLD", "USDT" ],
        },
    }),
    "ticker/pancakeswap.info": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.pancakeswap.info/api/v2/tokens/\\0\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("data").getFloat("price").multiply(1e6).round(),
    }),
    "ticker/revolut.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://www.revolut.com/api/exchange/quote?amount=1&country=\\2\\&fromCurrency=\\0\\&isRecipientAmount=false&toCurrency=\\1\\",
        headers: { 
            "Accept-language": "en",
        },
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("rate").getFloat("rate").multiply(1e6).round(),
        samples: {
            "hkd/usd": [ "HKD", "USD", "US" ],
            "krw/usd": [ "KRW", "USD", "KR" ],
        },
    }),
    "ticker/revolut.com#9": Witnet.RadonRetrievals.HttpGet({
        url: "https://www.revolut.com/api/exchange/quote?amount=1&country=\\2\\&fromCurrency=\\0\\&isRecipientAmount=false&toCurrency=\\1\\",
        headers: {
            "Accept-language": "en",
        },
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("rate").getFloat("rate").multiply(1e9).round(),
    }),
    "ticker/ultron-dev.net": Witnet.RadonRetrievals.HttpGet({
        url: "https://exchange-info.ultron-dev.net/api/v1/ultronswap",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("\\1\\_\\0\\").getFloat("last_price").multiply(1e6).round(),
        samples: { 
            "wbtc/wulx": [ "0xd2b86a80a8f30b83843e247a50ecdc8d843d87dd", "0x3a4f06431457de873b588846d139ec0d86275d54" ], 
        },
    }),
    "ticker/ultron-dev.net#inverse": Witnet.RadonRetrievals.HttpGet({
        url: "https://exchange-info.ultron-dev.net/api/v1/ultronswap",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("\\0\\_\\1\\").getFloat("last_price").power(-1).multiply(1e6).round(),
        samples: { 
            "weth/wulx": [ "0x2318bf5809a72aabadd15a3453a18e50bbd651cd", "0x3a4f06431457de873b588846d139ec0d86275d54" ], 
        },
    }),
    "ticker/upbit.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.upbit.com/v1/ticker?markets=\\1\\-\\0\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONArray().getMap(0).getFloat("trade_price").multiply(1e6).round(),
        samples: {
            "bat/usdt": [ "BAT", "USDT" ],
        },
    }),
    "ticker/xt.pub": Witnet.RadonRetrievals.HttpGet({
        url: "https://www.xt.pub/exchange/api/markets/returnTicker",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("\\0\\_\\1\\").getFloat("last").multiply(1e6).round(),
    }),
}
