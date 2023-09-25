const Witnet = require("witnet-utils")
const retrievals = new Witnet.Dictionary(Witnet.Retrievals.Class, require("../../assets/witnet/retrievals"))
const templates = new Witnet.Dictionary(Witnet.Artifacts.Template, require("../../assets/witnet/templates"))

module.exports = {
    price_feeds: {
        WitnetRequestPriceAdaUsd6: Witnet.PriceTickerRequest(
            retrievals, { 
                "bitstamp.net/ticker": ["ada", "usd"], 
                "bittrex.com/ticker": ["ADA", "USD"], 
                "coinbase.com/ticker": ["ADA", "USD"], 
                "kraken.com/ticker": ["ADA", "USD"],
            }
        ),
        WitnetRequestPriceAlgoUsd6: Witnet.PriceTickerRequest(
            retrievals, { 
                "bitstamp.net/ticker": ["algo", "usd"], 
                "bittrex.com/ticker": ["ALGO", "USD"], 
                "coinbase.com/ticker": ["ALGO", "USD"], 
                "kraken.com/ticker": ["ALGO", "USD"], 
            }
        ),
        WitnetRequestPriceApeUsd6: Witnet.PriceTickerRequest(
            retrievals, { 
                "binance.us/ticker": ["APE", "USD"], 
                "coinbase.com/ticker": ["APE", "USD"], 
                "kraken.com/ticker": ["APE", "USD"],
            }
        ),
        WitnetRequestPriceAtomUsd6: Witnet.PriceTickerRequest(
            retrievals, { 
                "bittrex.com/ticker": ["ATOM", "USD"], 
                "coinbase.com/ticker": ["ATOM", "USD"], 
                "kraken.com/ticker": ["ATOM", "USD"],
            }
        ),
        WitnetRequestPriceAvaxUsd6: Witnet.PriceTickerRequest(
            retrievals, { 
                "binance.us/ticker": ["AVAX", "USD"], 
                "bittrex.com/ticker": ["AVAX", "USD"], 
                "coinbase.com/ticker": ["AVAX", "USD"],
                "kraken.com/ticker": ["AVAX", "USD"],
             }
            ),
        WitnetRequestPriceBatUsdt6: Witnet.PriceTickerRequest(
            retrievals, { 
                "binance.us/ticker": ["BAT", "USDT"], 
                "bitrue.com/ticker": ["BATUSDT"], 
                "coinbase.com/ticker": ["BAT", "USDT"], 
                "okx.com/ticker": ["BAT", "USDT"], 
                "upbit.com/ticker": ["BAT", "USDT"] 
            }
        ),
        WitnetRequestPriceBnbUsdt6: Witnet.PriceTickerRequest(
            retrievals, { 
                "binance.com/ticker": ["BNB", "USDT"], 
                "bybit.com/ticker": ["BNB", "USDT"], 
                "gateapi.io/ticker": ["bnb", "usdt"], 
                "huobi.pro/ticker": ["bnb", "usdt"], 
                "kucoin.com/ticker": ["BNB", "USDT"], 
                "okx.com/ticker": ["BNB", "USDT"] 
            }
        ),
        WitnetRequestPriceBobaUsdt6: Witnet.PriceTickerRequest(
            retrievals, { 
                "gateapi.io/ticker": ["boba", "usdt"], 
                "huobi.pro/ticker": ["boba", "usdt"], 
                "mexc.com/ticker": ["BOBA", "USDT"] 
            }
        ),
        WitnetRequestPriceBoringUsdt6: Witnet.PriceTickerRequest(
            retrievals, { 
                "gateapi.io/ticker": ["boring", "usdt"], 
                "huobi.pro/ticker": ["boring", "usdt"], 
                "mexc.com/ticker": ["BORING", "USDT"], 
                "okx.com/ticker": ["BORING", "USDT"] 
            }
        ),
        WitnetRequestPriceBtcUsd6: Witnet.PriceTickerRequest(
            retrievals, { 
                "binance.us/ticker": ["BTC", "USD"], 
                "bitfinex.com/ticker": ["btc", "usd"], 
                "bitstamp.net/ticker": ["btc", "usd"], 
                "bittrex.com/ticker": ["BTC", "USD"], 
                "coinbase.com/ticker": ["BTC", "USD"], 
                "kraken.com/ticker": ["BTC", "USD"] 
            }
        ),
        WitnetRequestPriceBusdUsdt6: Witnet.PriceTickerRequest(
            retrievals, { 
                "binance.com/ticker": ["BUSD", "USDT"], 
                "bitmart.com/ticker": ["BUSD", "USDT"], 
                "kucoin.com/ticker": ["BUSD", "USDT"], 
                "indoex.io/ticker": ["BUSD", "USDT"] 
            }
        ),
        WitnetRequestPriceCeloEur6: Witnet.PriceTickerRequest(
            retrievals, { 
                "bitvavo.com/ticker": ["CELO", "EUR"], 
                "coinbase.com/ticker": ["CGLD", "EUR"] 
            }
        ),
        WitnetRequestPriceCeloUsd6: Witnet.PriceTickerRequest(
            retrievals, { 
                "binance.us/ticker": ["CELO", "USD"], 
                "coinbase.com/ticker": ["CGLD", "USD"], 
                "okx.com/ticker": ["CELO", "USDT"] 
            }
        ),
        WitnetRequestPriceCfxUsdt6: Witnet.PriceTickerRequest(
            retrievals, { 
                "binance.com/ticker": ["CFX", "USDT"], 
                "gateapi.io/ticker": ["cfx", "usdt"], 
                "kucoin.com/ticker": ["CFX", "USDT"], 
                "okx.com/ticker": ["CFX", "USDT"], 
                "mexc.com/ticker": ["CFX", "USDT"] 
            }
        ),
        WitnetRequestPriceCroUsdt6: Witnet.PriceTickerRequest(
            retrievals, { 
                "bittrex.com/ticker": ["CRO", "USDT"], 
                "coinbase.com/ticker": ["CRO", "USDT"], 
                "gateapi.io/ticker": ["cro", "usdt"], 
                "kucoin.com/ticker": ["CRO", "USDT"] 
            }
        ),
        WitnetRequestPriceDaiUsd6: Witnet.PriceTickerRequest(
            retrievals, { 
                "binance.us/ticker": ["DAI", "USD"], 
                "bitstamp.net/ticker": ["dai", "usd"], 
                "bittrex.com/ticker": ["DAI", "USD"], 
                "kraken.com/ticker": ["DAI", "USD"], 
                "gateapi.io/ticker": ["dai", "usd"] 
            }
        ),
        WitnetRequestPriceDogeUsd6: Witnet.PriceTickerRequest(
            retrievals, { 
                "binance.us/ticker": ["DOGE", "USD"], 
                "bittrex.com/ticker": ["DOGE", "USD"], 
                "coinbase.com/ticker": ["DOGE", "USD"], 
                "kraken.com/ticker": ["DOGE", "USD"] 
            }
        ),
        WitnetRequestPriceDotUsd6: Witnet.PriceTickerRequest(
            retrievals, { 
                "bittrex.com/ticker": ["DOT", "USD"], 
                "coinbase.com/ticker": ["DOT", "USD"], 
                "kraken.com/ticker": ["DOT", "USD"] 
            }
        ),
        WitnetRequestPriceElaUsdt6: Witnet.PriceTickerRequest(
            retrievals, { 
                "gateapi.io/ticker": ["ela", "usdt"], 
                "huobi.pro/ticker": ["ela", "usdt"], 
                "kucoin.com/ticker": ["ELA", "USDT"] 
            }
        ),
        WitnetRequestPriceElonUsdt9: Witnet.PriceTickerRequest(
            retrievals, { 
                "gateapi.io/ticker#9": ["elon", "usdt"], 
                "huobi.pro/ticker#9": ["elon", "usdt"], 
                "kucoin.com/ticker#9": ["ELON", "USDT"], 
                "mexc.com/ticker#9": ["ELON", "USDT"], 
                "okx.com/ticker#9": ["ELON", "USDT"] 
            }
        ),
        WitnetRequestPriceEosUsd6: Witnet.PriceTickerRequest(
            retrievals, { 
                "bittrex.com/ticker": ["EOS", "USD"], 
                "coinbase.com/ticker": ["EOS", "USD"], 
                "kraken.com/ticker": ["EOS", "USD"] 
            }
        ),
        WitnetRequestPriceEthUsd6: Witnet.PriceTickerRequest(
            retrievals, { 
                "binance.us/ticker": ["ETH", "USD"], 
                "bitfinex.com/ticker": ["eth", "usd"], 
                "bitstamp.net/ticker": ["eth", "usd"], 
                "bittrex.com/ticker": ["ETH", "USD"], 
                "coinbase.com/ticker": ["ETH", "USD"], 
                "kraken.com/ticker": ["ETH", "USD"] 
            }
        ),
        WitnetRequestPriceFraxUsdt6: Witnet.PriceTickerRequest(
            retrievals, { 
                "gateapi.io/ticker": ["frax", "usdt"], 
                "uniswap-v3/ticker": ["0xc2a856c3aff2110c1171b8f942256d40e980c726", "1"] 
            }
        ), 
        WitnetRequestPriceFtmUsdt6: Witnet.PriceTickerRequest(
            retrievals, { 
                "binance.com/ticker": ["FTM", "USDT"], 
                "bittrex.com/ticker": ["FTM", "USDT"], 
                "gateapi.io/ticker": ["ftm", "usdt"], 
                "huobi.pro/ticker": ["ftm", "usdt"], 
                "kucoin.com/ticker": ["FTM", "USDT"], 
                "mexc.com/ticker": ["FTM", "USDT"] 
            }
        ),
        WitnetRequestPriceFuseUsdt6: Witnet.PriceTickerRequest(
            retrievals, { 
                "ascendex.com/ticker": ["FUSE", "USDT"], 
                "gateapi.io/ticker": ["fuse", "usdt"],
                "huobi.pro/ticker": ["fuse", "usdt"], 
                "mexc.com/ticker": ["FUSE", "USDT"] 
            }
        ),
        WitnetRequestPriceGlintUsdc6: Witnet.RequestFromTemplate(
            templates['WitnetRequestTemplateBeamswapTicker6'], [
                ["0x61b4cec9925b1397b64dece8f898047eed0f7a07", "0"]
            ]
        ),
        WitnetRequestPriceGlmrUsdt6: Witnet.PriceTickerRequest(
            retrievals, { 
                "binance.com/ticker": ["GLMR", "USDT"], 
                "gateapi.io/ticker": ["glmr", "usdt"], 
                "kucoin.com/ticker": ["GLMR", "USDT"], 
                "mexc.com/ticker": ["GLMR", "USDT"], 
                "okx.com/ticker": ["GLMR", "USDT"] 
            }
        ),
        WitnetRequestPriceHtUsdt6: Witnet.PriceTickerRequest(
            retrievals, { 
                "ascendex.com/ticker": ["HT", "USDT"], 
                "gateapi.io/ticker": ["ht", "usdt"], 
                "huobi.pro/ticker": ["ht", "usdt"], 
                "mexc.com/ticker": ["HT", "USDT"] 
            }
        ),
        WitnetRequestPriceImmoMcusd6: Witnet.RequestFromTemplate(
            templates['WitnetRequestTemplateUbeswapTicker6'], [
                ["0x7d63809ebf83ef54c7ce8ded3591d4e8fc2102ee", "0"]
            ]
        ),
        WitnetRequestPriceKavaUsdt6: Witnet.PriceTickerRequest(
            retrievals, { 
                "binance.com/ticker": ["KAVA", "USDT"], 
                "gateapi.io/ticker": ["kava", "usdt"], 
                "huobi.pro/ticker": ["kava", "usdt"], 
                "kucoin.com/ticker": ["KAVA", "USDT"], 
                "mexc.com/ticker": ["KAVA", "USDT"] 
            }
        ),
        WitnetRequestPriceKcsUsdt6: Witnet.PriceTickerRequest(
            retrievals, { 
                "ascendex.com/ticker": ["KCS", "USDT"], 
                "kucoin.com/ticker": ["KCS", "USDT"], 
                "mexc.com/ticker": ["KCS", "USDT"], 
                "mojitoswap/ticker": ["0xb3b92d6b2656f9ceb4a381718361a21bf9b82bd9", "0"] 
            }
        ),
        WitnetRequestPriceKlayUsdt6: Witnet.PriceTickerRequest(
            retrievals, { 
                "binance.com/ticker": ["KLAY", "USDT"], 
                "gateapi.io/ticker": ["klay", "usdt"], 
                "kucoin.com/ticker": ["KLAY", "USDT"], 
                "okx.com/ticker": ["KLAY", "USDT"] 
            }
        ),
        WitnetRequestPriceKrwUsd9: Witnet.PriceTickerRequest(
            retrievals, { 
                "exchangerate.host/ticker#9": ["KRW", "USD"], 
                "fastforex.io/ticker#9": ["KRW", "USD"], 
                "jsdelivr.net/ticker#9": ["krw", "usd"] 
            }
        ),
        WitnetRequestPriceKspKrw6: Witnet.PriceTickerRequest(
            retrievals, { 
                "coinone.co.kr/ticker": ["krw", "ksp"], 
                "korbit.co.kr/ticker": ["ksp", "krw"] 
            }
        ),
        WitnetRequestPriceLinkUsd6: Witnet.PriceTickerRequest(
            retrievals, { 
                "bitstamp.net/ticker": ["link", "usd"], 
                "coinbase.com/ticker": ["LINK", "USD"], 
                "kraken.com/ticker": ["LINK", "USD"] 
            }
        ),
        WitnetRequestPriceMaticUsd6: Witnet.PriceTickerRequest(
            retrievals, { 
                "binance.us/ticker": ["MATIC", "USD"], 
                "bitstamp.net/ticker": ["matic", "usd"], 
                "coinbase.com/ticker": ["MATIC", "USD"], 
                "kraken.com/ticker": ["MATIC", "USD"] 
            }
        ),
        WitnetRequestPriceMetisUsdt6: Witnet.PriceTickerRequest(
            retrievals, { 
                "gateapi.io/ticker": ["metis", "usdt"], 
                "kucoin.com/ticker": ["METIS", "USDT"], 
                "mexc.com/ticker": ["METIS", "USDT"] 
            }
        ),
        WitnetRequestPriceMjtKcs9: Witnet.PriceTickerRequest(
            retrievals, { 
                "kucoin.com/ticker#9": ["MJT", "KCS"],
                "mojitoswap/ticker#9": ["0xa0d7c8aa789362cdf4faae24b9d1528ed5a3777f", "1"] 
            }
        ),
        WitnetRequestPriceMntUsdt6: Witnet.PriceTickerRequest(
            retrievals, {
                "bitmart.com/ticker": ["MNT", "USDT"], 
                "gateapi.io/ticker": ["mnt", "usdt"],
                "mexc.com/ticker": ["MNT", "USDT"], 
            }
        ),
        WitnetRequestPriceMtrUsdt6: Witnet.PriceTickerRequest(
            retrievals, { 
                "gateapi.io/ticker": ["mtr", "usdt"], 
                "mexc.com/ticker": ["MTR", "USDT"] 
            }
        ),
        WitnetRequestPriceMtrgUsdt6: Witnet.PriceTickerRequest(
            retrievals, { 
                "gateapi.io/ticker": ["mtrg", "usdt"], 
                "kucoin.com/ticker": ["MTRG", "USDT"], 
                "mexc.com/ticker": ["MTRG", "USDT"] 
            }
        ),
        WitnetRequestPriceNctCelo6: Witnet.RequestFromTemplate(
            templates['WitnetRequestTemplateUniswapCeloTicker6'], [
                ["0xdb24905b1b080f65dedb0ad978aad5c76363d3c6", "1"]
            ]
        ),
        WitnetRequestPriceOktUsdt6: Witnet.PriceTickerRequest(
            retrievals, { 
                "gateapi.io/ticker": ["okt", "usdt"], 
                "okx.com/ticker": ["OKT", "USDT"], 
                "mexc.com/ticker": ["OKT", "USDT"] 
            }
        ),
        WitnetRequestPriceOloUsdc6: Witnet.RequestFromTemplate(
            templates['WitnetRequestTemplateOolongTicker6'], [
                ["0x5008f837883ea9a07271a1b5eb0658404f5a9610", "0x66a2a913e447d6b4bf33efbec43aaef87890fbbc"]
            ]
        ),
        WitnetRequestPriceOpUsdt6: Witnet.PriceTickerRequest(
            retrievals, { 
                "binance.com/ticker": ["OP", "USDT"], 
                // "bkex.com/ticker": ["OP", "USDT"], 
                "digifinex.com/ticker": ["op", "usdt"], 
                "gateapi.io/ticker": ["op", "usdt"], 
                "kucoin.com/ticker": ["OP", "USDT"], 
                "okx.com/ticker": ["OP", "USDT"] 
            }
        ),
        WitnetRequestPriceQuickUsdc6: Witnet.RequestFromTemplate(
            templates['WitnetRequestTemplateQuickswapTicker6'], [
                ["0x022df0b3341b3a0157eea97dd024a93f7496d631", "0"]
            ]
        ),
        WitnetRequestPriceQuickWeth9: Witnet.RequestFromTemplate(
            templates['WitnetRequestTemplateQuickswapTicker9'], [
                ["0xde2d1fd2e8238aba80a5b80c7262e4833d92f624", "0"]
            ]
        ),
        WitnetRequestPriceQuickWmatic6: Witnet.RequestFromTemplate(
            templates['WitnetRequestTemplateQuickswapTicker6'], [
                ["0x9f1a8caf3c8e94e43aa64922d67dff4dc3e88a42", "0"]
            ]
        ),
        WitnetRequestPriceSaxUsdt6: Witnet.PriceTickerRequest(
            retrievals, { 
                "mojitoswap/ticker": ["0x1162131b63d95210acf5b3419d38c68492f998cc", "0"] 
            }
        ),
        WitnetRequestPriceShibUsd9: Witnet.PriceTickerRequest(
            retrievals, { 
                "coinbase.com/ticker#9": ["SHIB", "USD"], 
                "gateapi.io/ticker#9": ["shib", "usd"], 
                "kraken.com/ticker#9": ["SHIB", "USD"] 
            }
        ),
        WitnetRequestPriceSolUsd6: Witnet.PriceTickerRequest(
            retrievals, { 
                "coinbase.com/ticker": ["SOL", "USD"], 
                "kraken.com/ticker": ["SOL", "USD"] 
            }
        ),
        WitnetRequestPriceStellaUsdt6: Witnet.RequestFromTemplate(
            templates['WitnetRequestTemplateStellaswapTicker6'], [
                ["0x81e11a9374033d11cc7e7485a7192ae37d0795d6", "1"]
            ]
        ),
        WitnetRequestPriceTusdUsdt6: Witnet.PriceTickerRequest(
            retrievals, { 
                "binance.com/ticker": ["TUSD", "USDT"], 
                "bittrex.com/ticker": ["TUSD", "USDT"], 
                "huobi.pro/ticker": ["tusd", "usdt"] 
            }
        ),
        WitnetRequestPriceUlxUsdt6: Witnet.PriceTickerRequest(
            retrievals, { 
                "uniswap-v3/ticker": ["0x9adf4617804c762f86fc4e706ad0424da3b100a7", "1"] 
            }
        ),
        WitnetRequestPriceUniUsd6: Witnet.PriceTickerRequest(
            retrievals, { 
                "bitfinex.com/ticker": ["uni", "usd"], 
                "bitstamp.net/ticker": ["uni", "usd"], 
                "coinbase.com/ticker": ["UNI", "USD"], 
                "gemini.com/ticker": ["uni", "usd"], 
                "kraken.com/ticker": ["UNI", "USD"] 
            }
        ),
        WitnetRequestPriceUsdcUsd6: Witnet.PriceTickerRequest(
            retrievals, { 
                "bitstamp.net/ticker": ["usdc", "usd"], 
                "bittrex.com/ticker": ["USDC", "USD"], 
                "gemini.com/ticker": ["usdc", "usd"], 
                "kraken.com/ticker": ["USDC", "USD"] 
            }
        ),
        WitnetRequestPriceUsdtUsd6: Witnet.PriceTickerRequest(
            retrievals, { 
                "binance.us/ticker": ["USDT", "USD"], 
                "bitstamp.net/ticker": ["usdt", "usd"], 
                "bittrex.com/ticker": ["USDT", "USD"], 
                "kraken.com/ticker": ["USDT", "USD"] 
            }
        ),
        WitnetRequestPriceVsqDai6: Witnet.RequestFromTemplate(
            templates['WitnetRequestTemplateSushiswapTicker6'], [
                ["0x5cf66ceaf7f6395642cd11b5929499229edef531", "1"]
            ]
        ),
        WitnetRequestPriceWbtcUsd6: Witnet.PriceTickerRequest(
            retrievals, {
                "coinbase.com/ticker": ["WBTC", "USD"], 
                "kraken.com/ticker": ["WBTC", "USD"] 
            }
        ),
        WitnetRequestPriceWbtcWulx6: Witnet.PriceTickerRequest(
            retrievals, { 
                "ultron-dev.net/ticker": ["0xd2b86a80a8f30b83843e247a50ecdc8d843d87dd", "0x3a4f06431457de873b588846d139ec0d86275d54"] 
            }
        ),
        WitnetRequestPriceWethWulx6: Witnet.PriceTickerRequest(
            retrievals, { 
                "ultron-dev.net/ticker#inverse": ["0x2318bf5809a72aabadd15a3453a18e50bbd651cd", "0x3a4f06431457de873b588846d139ec0d86275d54"] 
            }
        ),
        WitnetRequestPriceWitUsdt6: Witnet.PriceTickerRequest(
            retrievals, { 
                "bitmart.com/ticker": ["WIT", "USDT"], 
                "gateapi.io/ticker": ["wit", "usdt"], 
                "mexc.com/ticker": ["WIT", "USDT"] 
            }
        ),
        WitnetRequestPriceXlmUsd6: Witnet.PriceTickerRequest(
            retrievals, { 
                "bitstamp.net/ticker": ["xlm", "usd"], 
                "bittrex.com/ticker": ["XLM", "USD"], 
                "coinbase.com/ticker": ["XLM", "USD"], 
                "kraken.com/ticker": ["XLM", "USD"] 
            }
        ),
    },
    /////// REQUEST TEMPLATES ///////////////////////////////////////////////////////
    // path: { ... path: {
    //      WitnetRequestTemplateXXX: Witnet.RequestTemplate({
    //          specs: {
    //              retrieve: [ retrievals['retrieval-artifact-name-x'], ... ],
    //              aggregate?: Witnet.Reducers..,
    //              tally?: Witnet.Reducers..,
    //          },
    //          tests?: {
    //              "test-description-1": [
    //                  [ "..", ... ], // retrieval #0 args (string[])
    //                  ...
    //              ],
    //              ...
    //          }
    //      },
    //      ...
    // }, ... },
};    
