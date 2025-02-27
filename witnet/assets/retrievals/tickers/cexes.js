const { utils, Witnet } = require("witnet-solidity")
const { legacy } = require("witnet-solidity/assets")

module.exports = {
    "ticker/aex.zone": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.aex.zone/v2/exchange-rates?currency=\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("data").getMap("rates").getFloat("\\0\\").power(-1).multiply(1e6).round(),
    }),
    "ticker/ascendex.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://ascendex.com/api/pro/v1/spot/ticker?symbol=\\0\\/\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("data").getFloat("close").multiply(1e6).round(),
    }),
    "ticker/bkex.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.bkex.com/v2/q/ticker/price?symbol=\\0\\_\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getArray("data").getMap(0).getFloat("price").multiply(1e6).round(),
        tuples: {
            "OP/USDT-6": [ "OP", "USDT" ],
            "REEF/USDT-6": [ "REEF", "USDT" ],
            "SYS/USDT-6": [ "SYS", "USDT" ],
        },
    }),
    "ticker/binance.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.binance.com/api/v3/ticker/price?symbol=\\0\\\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getFloat("price").multiply(1e6).round(),
    }),
    "ticker/binance.us": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.binance.us/api/v3/ticker/price?symbol=\\0\\\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getFloat("price").multiply(1e6).round(),
    }),
    "ticker/bitfinex.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.bitfinex.com/v1/pubticker/\\0\\\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getFloat("last_price").multiply(1e6).round(),
    }),
    "ticker/ticker/bitfinex.com#v2": Witnet.RadonRetrievals.HttpGet({
        url: "https://api-pub.bitfinex.com/v2/ticker/\\0\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getFloat(0).multiply(1e6).round(),
    }),
    "ticker/bitget.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.bitget.com/api/spot/v1/market/ticker?symbol=\\0\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("data").getFloat("close").multiply(1e6).round(),
        tuples: { "SYS/USDT-6": [ "SYSUSDT_SPBL" ], }
    }),
    "ticker/bitget.com#v2": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.bitget.com/api/v2/spot/market/tickers?symbol=\\0\\\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getArray("data").getMap(0).getFloat("lastPr").multiply(1e6).round(),
        tuples: { "KAIA/USDT-6": [ "KAIA", "USDT", ], }
    }),
    "ticker/bitmart.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://api-cloud.bitmart.com/spot/v1/ticker?symbol=\\0\\_\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("data").getArray("tickers").getMap(0).getFloat("last_price").multiply(1e6).round(),
    }),
    "ticker/bitrue.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://openapi.bitrue.com/api/v1/ticker/price?symbol=\\0\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getFloat("price").multiply(1e6).round(),
    }),
    "ticker/bitstamp.net": Witnet.RadonRetrievals.HttpGet({
        url: "https://www.bitstamp.net/api/v2/ticker/\\0\\\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getFloat("last").multiply(1e6).round(),
    }),
    "ticker/bittrex.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.bittrex.com/v3/markets/\\0\\-\\1\\/ticker",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getFloat("lastTradeRate").multiply(1e6).round(),
    }),
    "ticker/bitvavo.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.bitvavo.com/v2/ticker/price?market=\\0\\-\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getFloat("price").multiply(1e6).round(),
    }),
    "ticker/bybit.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.bybit.com/v5/market/tickers?category=\\2\\&symbol=\\0\\\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("result").getArray("list").getMap(0).getFloat("lastPrice").multiply(1e6).round(),
    }),
    "ticker/coinbase.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.coinbase.com/v2/exchange-rates?currency=\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("data").getMap("rates").getFloat("\\0\\").power(-1).multiply(1e6).round(),
    }),
    "ticker/coinbase.com#9": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.coinbase.com/v2/exchange-rates?currency=\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("data").getMap("rates").getFloat("\\0\\").power(-1).multiply(1e9).round(),
    }),
    "ticker/coinflex.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://v2api.coinflex.com/v3/tickers?marketCode=\\0\\-\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getArray("data").getMap(0).getFloat("markPrice").multiply(1e6).round(),
    }),
    "ticker/coinone.co.kr": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.coinone.co.kr/public/v2/ticker_new/\\0\\/\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getArray("tickers").getMap(0).getFloat("last").multiply(1e3).round(),
    }),
    "ticker/coinyep.com#9": Witnet.RadonRetrievals.HttpGet({
        url: "https://coinyep.com/api/v1/?from=\\0\\&to=\\1\\&lang=es&format=json",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getFloat("price").multiply(1e9).round(),
    }),
    "ticker/digifinex.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://openapi.digifinex.com/v3/ticker?symbol=\\0\\_\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getArray("ticker").getMap(0).getFloat("last").multiply(1e6).round(),
    }),
    "ticker/freeforexapi.com#9": Witnet.RadonRetrievals.HttpGet({
        url: "https://www.freeforexapi.com/api/live?pairs=\\0\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("rates").getMap("\\0\\").getFloat("rate").power(-1).multiply(1e9).round(),
    }),
    "ticker/gateapi.io": Witnet.RadonRetrievals.HttpGet({
        url: "https://data.gateapi.io/api2/1/ticker/\\0\\_\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getFloat("last").multiply(1e6).round(),
    }),
    "ticker/gateapi.io#9": Witnet.RadonRetrievals.HttpGet({
        url: "https://data.gateapi.io/api2/1/ticker/\\0\\_\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getFloat("last").multiply(1e9).round(),
    }),
    "ticker/exchangerate.host#9": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.exchangerate.host/latest?base=\\0\\&symbol=\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("rates").getFloat("\\1\\").multiply(1e9).round(),
        tuples: { "KRW/USD-9": [ "KRW", "USD" ] },
    }),
    "ticker/fastforex.io#9": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.fastforex.io/fetch-one?from=\\0\\&to=\\1\\&api_key=demo",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("result").getFloat("\\1\\").multiply(1e9).round(),
        tuples: { "KRW/USD-9": [ "KRW", "USD" ] },
    }),
    "ticker/gemini.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.gemini.com/v1/pubticker/\\0\\\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getFloat("last").multiply(1e6).round(),
        tuples: { "USDC/USD-6": [ "usdc", "usd" ] },
    }),
    "ticker/hitbtc.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.hitbtc.com/api/3/public/ticker?symbols=\\0\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("\\0\\").getFloat("last").multiply(1e6).round(),
        tuples: { "REEF/USDT-6": [ "REEFUSDT" ] },
    }),
    "ticker/hotbit.io": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.hotbit.io/api/v1/market.last?market=\\0\\\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getFloat("result").multiply(1e6).round(),
        tuples: { 
            "GLMR/USDT-6": [ "GLMR", "USDT" ],
            "METIS/USDT-6": [ "METIS", "USDT" ],
        },
    }),
    "ticker/huobi.pro": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.huobi.pro/market/detail/merged?symbol=\\0\\\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("tick").getFloat("close").multiply(1e6).round(),
        tuples: {
            "BNB/USDT-6": [ "bnb", "usdt" ],
            "BOBA/USDT-6": [ "boba", "usdt" ],
            "BORING/USDT-6": [ "boring", "usdt" ],
            "CUBE/USDT-6": [ "cube", "usdt" ],
            "ELON/USDT-6": [ "elon", "usdt" ],
            "FTM/USDT-6": [ "ftm", "usdt" ],
            "KAVA/USDT-6": [ "kava", "usdt" ],
        }
    }),
    "ticker/huobi.pro#9": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.huobi.pro/market/detail/merged?symbol=\\0\\\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("tick").getFloat("close").multiply(1e6).round(),
        tuples: {
            "BNB/USDT-9": [ "bnb", "usdt" ],
            "BOBA/USDT-9": [ "boba", "usdt" ],
            "BORING/USDT-9": [ "boring", "usdt" ],
            "CUBE/USDT-9": [ "cube", "usdt" ],
            "ELON/USDT-9": [ "elon", "usdt" ],
            "FTM/USDT-9": [ "ftm", "usdt" ],
            "KAVA/USDT-9": [ "kava", "usdt" ],
        },
    }),
    "ticker/indoex.io": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.indoex.io/getSelectedMarket/\\0\\_\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getArray("marketdetails").getMap(0).getFloat("last").multiply(1e6).round(),
        tuples: { "BUSD/USDT-6": [ "BUSD", "USDT", ]},
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
    }),
    "ticker/kraken.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.kraken.com/0/public/Ticker?pair=\\0\\\\1\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("result").values().getMap(0).getArray("a").getFloat(0).multiply(1e6).round(),
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
    }),
    "ticker/pancakeswap.info": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.pancakeswap.info/api/v2/tokens/\\0\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("data").getFloat("price").multiply(1e6).round(),
    }),
    "ticker/revolut.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://www.revolut.com/api/exchange/quote?amount=1&country=\\2\\&fromCurrency=\\0\\&isRecipientAmount=false&toCurrency=\\1\\",
        headers: [ [ "Accept-language", "en" ] ],
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("rate").getFloat("rate").multiply(1e6).round(),
    }),
    "ticker/revolut.com#9": Witnet.RadonRetrievals.HttpGet({
        url: "https://www.revolut.com/api/exchange/quote?amount=1&country=\\2\\&fromCurrency=\\0\\&isRecipientAmount=false&toCurrency=\\1\\",
        headers: [ [ "Accept-language", "en" ] ],
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("rate").getFloat("rate").multiply(1e9).round(),
    }),
    "ticker/ultron-dev.net": Witnet.RadonRetrievals.HttpGet({
        url: "https://exchange-info.ultron-dev.net/api/v1/ultronswap",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("\\1\\_\\0\\").getFloat("last_price").multiply(1e6).round(),
        tuples: { "WBTC/WULX-6": [ "0xd2b86a80a8f30b83843e247a50ecdc8d843d87dd", "0x3a4f06431457de873b588846d139ec0d86275d54" ], }
    }),
    "ticker/ultron-dev.net#inverse": Witnet.RadonRetrievals.HttpGet({
        url: "https://exchange-info.ultron-dev.net/api/v1/ultronswap",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("\\0\\_\\1\\").getFloat("last_price").power(-1).multiply(1e6).round(),
        tuples: { "WETH/WULX-6": [ "0x2318bf5809a72aabadd15a3453a18e50bbd651cd", "0x3a4f06431457de873b588846d139ec0d86275d54" ], }
    }),
    "ticker/upbit.com": Witnet.RadonRetrievals.HttpGet({
        url: "https://api.upbit.com/v1/ticker?markets=\\1\\-\\0\\",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONArray().getMap(0).getFloat("trade_price").multiply(1e6).round(),
    }),
    "ticker/xt.pub": Witnet.RadonRetrievals.HttpGet({
        url: "https://www.xt.pub/exchange/api/markets/returnTicker",
        script: Witnet.RadonScript(Witnet.RadonString).parseJSONMap().getMap("\\0\\_\\1\\").getFloat("last").multiply(1e6).round(),
    }),
}
