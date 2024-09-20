const Witnet = require("witnet-toolkit")

const sources = Witnet.Dictionary(
    Witnet.Sources.Class, 
    require("../../sources")
);

const templates = Witnet.Dictionary(
    Witnet.Artifacts.Template, 
    require("../../templates")
);

module.exports = {

    WitnetRequestPriceAdaUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "bitstamp.net/ticker": ["ada", "usd"], 
            "coinbase.com/ticker": ["ADA", "USD"], 
            "kraken.com/ticker": ["ADA", "USD"],
        }
    ),
    
    WitnetRequestPriceAlgoUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "bitstamp.net/ticker": ["algo", "usd"], 
            "coinbase.com/ticker": ["ALGO", "USD"], 
            "kraken.com/ticker": ["ALGO", "USD"], 
        }
    ),
    
    WitnetRequestPriceApeUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.us/ticker": ["APE", "USD"], 
            "coinbase.com/ticker": ["APE", "USD"], 
            "kraken.com/ticker": ["APE", "USD"],
        }
    ),
    
    WitnetRequestPriceAtomUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "coinbase.com/ticker": ["ATOM", "USD"], 
            "kraken.com/ticker": ["ATOM", "USD"],
        }
    ),
    
    WitnetRequestPriceAvaxUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.us/ticker": ["AVAX", "USD"], 
            "bitstamp.net/ticker": ["avax", "usd"], 
            "coinbase.com/ticker": ["AVAX", "USD"],
            "gemini.com/ticker": ["avax", "usd"], 
            "kraken.com/ticker": ["AVAX", "USD"],
            }
        ),
    
    WitnetRequestPriceBatUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.us/ticker": ["BAT", "USDT"], 
            "bitrue.com/ticker": ["BATUSDT"], 
            "coinbase.com/ticker": ["BAT", "USDT"], 
            "okx.com/ticker": ["BAT", "USDT"], 
            "upbit.com/ticker": ["BAT", "USDT"] 
        }
    ),
    
    WitnetRequestPriceBnbUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.com/ticker": ["BNB", "USDT"], 
            "bybit.com/ticker": ["BNB", "USDT"], 
            "gateapi.io/ticker": ["bnb", "usdt"], 
            "huobi.pro/ticker": ["bnb", "usdt"], 
            "kucoin.com/ticker": ["BNB", "USDT"], 
            "okx.com/ticker": ["BNB", "USDT"] 
        }
    ),
    
    WitnetRequestPriceBobaUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "gateapi.io/ticker": ["boba", "usdt"], 
            "huobi.pro/ticker": ["boba", "usdt"], 
            "mexc.com/ticker": ["BOBA", "USDT"] 
        }
    ),
    
    WitnetRequestPriceBoringUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "gateapi.io/ticker": ["boring", "usdt"], 
            "huobi.pro/ticker": ["boring", "usdt"], 
            "mexc.com/ticker": ["BORING", "USDT"], 
            "okx.com/ticker": ["BORING", "USDT"] 
        }
    ),
    
    WitnetRequestPriceBtcUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.us/ticker": ["BTC", "USD"], 
            "bitfinex.com/ticker": ["btc", "usd"], 
            "bitstamp.net/ticker": ["btc", "usd"], 
            "coinbase.com/ticker": ["BTC", "USD"], 
            "gemini.com/ticker": ["btc", "usd"], 
            "kraken.com/ticker": ["BTC", "USD"] 
        }
    ),
    
    WitnetRequestPriceBusdUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.com/ticker": ["BUSD", "USDT"], 
        }
    ),
    
    WitnetRequestPriceCeloEur6: Witnet.PriceTickerRequest(
        sources, { 
            "bitvavo.com/ticker": ["CELO", "EUR"], 
            "coinbase.com/ticker": ["CGLD", "EUR"] 
        }
    ),
    
    WitnetRequestPriceCeloUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.us/ticker": ["CELO", "USD"], 
            "coinbase.com/ticker": ["CGLD", "USD"], 
            "okx.com/ticker": ["CELO", "USDT"] 
        }
    ),
    
    WitnetRequestPriceCfxUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.com/ticker": ["CFX", "USDT"], 
            "gateapi.io/ticker": ["cfx", "usdt"], 
            "kucoin.com/ticker": ["CFX", "USDT"], 
            "okx.com/ticker": ["CFX", "USDT"], 
            "mexc.com/ticker": ["CFX", "USDT"] 
        }
    ),
    
    WitnetRequestPriceCroUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "coinbase.com/ticker": ["CRO", "USDT"], 
            "gateapi.io/ticker": ["cro", "usdt"], 
            "kucoin.com/ticker": ["CRO", "USDT"],
            "mexc.com/ticker": ["CRO", "USDT"],
            "okx.com/ticker": ["CRO", "USDT"], 
        }
    ),
    
    WitnetRequestPriceDaiUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.us/ticker": ["DAI", "USD"], 
            "bitstamp.net/ticker": ["dai", "usd"], 
            "coinbase.com/ticker": ["DAI", "USD"], 
            "gateapi.io/ticker": ["dai", "usd"],
            "gemini.com/ticker": ["dai", "usd"], 
            "kraken.com/ticker": ["DAI", "USD"], 
        }
    ),
    
    WitnetRequestPriceDogeUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.us/ticker": ["DOGE", "USD"], 
            "coinbase.com/ticker": ["DOGE", "USD"], 
            "kraken.com/ticker": ["DOGE", "USD"] 
        }
    ),
    
    WitnetRequestPriceDotUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "bittrex.com/ticker": ["DOT", "USD"], 
            "coinbase.com/ticker": ["DOT", "USD"], 
            "kraken.com/ticker": ["DOT", "USD"] 
        }
    ),
    
    WitnetRequestPriceElaUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "gateapi.io/ticker": ["ela", "usdt"], 
            "huobi.pro/ticker": ["ela", "usdt"], 
            "kucoin.com/ticker": ["ELA", "USDT"] 
        }
    ),
    
    WitnetRequestPriceElonUsdt9: Witnet.PriceTickerRequest(
        sources, { 
            "gateapi.io/ticker#9": ["elon", "usdt"], 
            "huobi.pro/ticker#9": ["elon", "usdt"], 
            "kucoin.com/ticker#9": ["ELON", "USDT"], 
            "mexc.com/ticker#9": ["ELON", "USDT"], 
            "okx.com/ticker#9": ["ELON", "USDT"] 
        }
    ),
    
    WitnetRequestPriceEosUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "ascendex.com/ticker": ["EOS", "USD"],
            "bitfinex.com/ticker": ["eos", "usd"], 
            "coinbase.com/ticker": ["EOS", "USD"], 
            "kraken.com/ticker": ["EOS", "USD"] 
        }
    ),
    
    WitnetRequestPriceEthUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.us/ticker": ["ETH", "USD"], 
            "bitfinex.com/ticker": ["eth", "usd"], 
            "bitstamp.net/ticker": ["eth", "usd"], 
            "coinbase.com/ticker": ["ETH", "USD"], 
            "kraken.com/ticker": ["ETH", "USD"],
            "gemini.com/ticker": ["eth", "usd"],  
        }
    ),
    
    WitnetRequestPriceFraxUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "gateapi.io/ticker": ["frax", "usdt"],
        }
    ), 
    
    WitnetRequestPriceFtmUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.com/ticker": ["FTM", "USDT"], 
            "bybit.com/ticker": ["FTM", "USDT"], 
            "digifinex.com/ticker": ["ftm", "usdt"], 
            "gateapi.io/ticker": ["ftm", "usdt"], 
            "huobi.pro/ticker": ["ftm", "usdt"], 
            "kucoin.com/ticker": ["FTM", "USDT"], 
            "mexc.com/ticker": ["FTM", "USDT"],
            "okx.com/ticker": ["FTM", "USDT"] 
        }
    ),
    
    WitnetRequestPriceFuseUsdt6: Witnet.PriceTickerRequest(
        sources, { 
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
        sources, { 
            "binance.com/ticker": ["GLMR", "USDT"], 
            "gateapi.io/ticker": ["glmr", "usdt"], 
            "kucoin.com/ticker": ["GLMR", "USDT"], 
            "mexc.com/ticker": ["GLMR", "USDT"], 
            "okx.com/ticker": ["GLMR", "USDT"] 
        }
    ),
    
    WitnetRequestPriceHtUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            // "ascendex.com/ticker": ["HT", "USDT"], 
            "gateapi.io/ticker": ["ht", "usdt"], 
            // "huobi.pro/ticker": ["ht", "usdt"], 
            // "mexc.com/ticker": ["HT", "USDT"] 
        }
    ),
    
    WitnetRequestPriceImmoMcusd6: Witnet.RequestFromTemplate(
        templates['WitnetRequestTemplateUbeswapTicker6'], [
            ["0x7d63809ebf83ef54c7ce8ded3591d4e8fc2102ee", "0"]
        ]
    ),
    
    WitnetRequestPriceKavaUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.com/ticker": ["KAVA", "USDT"], 
            "gateapi.io/ticker": ["kava", "usdt"], 
            "huobi.pro/ticker": ["kava", "usdt"], 
            "kucoin.com/ticker": ["KAVA", "USDT"], 
            "mexc.com/ticker": ["KAVA", "USDT"] 
        }
    ),
    
    WitnetRequestPriceKcsUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "ascendex.com/ticker": ["KCS", "USDT"], 
            "kucoin.com/ticker": ["KCS", "USDT"], 
            "mexc.com/ticker": ["KCS", "USDT"], 
            "mojitoswap/ticker": ["0xb3b92d6b2656f9ceb4a381718361a21bf9b82bd9", "0"] 
        }
    ),
    
    WitnetRequestPriceKlayUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.com/ticker": ["KLAY", "USDT"], 
            "gateapi.io/ticker": ["klay", "usdt"], 
            "kucoin.com/ticker": ["KLAY", "USDT"], 
            "okx.com/ticker": ["KLAY", "USDT"] 
        }
    ),
    
    WitnetRequestPriceKspKrw6: Witnet.PriceTickerRequest(
        sources, { 
            "coinone.co.kr/ticker": ["krw", "ksp"], 
            "korbit.co.kr/ticker": ["ksp", "krw"] 
        }
    ),
    
    WitnetRequestPriceLinkUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "bitstamp.net/ticker": ["link", "usd"], 
            "coinbase.com/ticker": ["LINK", "USD"], 
            "kraken.com/ticker": ["LINK", "USD"] 
        }
    ),
    
    WitnetRequestPriceMaticUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.us/ticker": ["MATIC", "USD"], 
            "bitstamp.net/ticker": ["matic", "usd"], 
            "coinbase.com/ticker": ["MATIC", "USD"], 
            "kraken.com/ticker": ["MATIC", "USD"] 
        }
    ),
    
    WitnetRequestPriceMetisUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "gateapi.io/ticker": ["metis", "usdt"], 
            "kucoin.com/ticker": ["METIS", "USDT"], 
            "mexc.com/ticker": ["METIS", "USDT"] 
        }
    ),
    
    WitnetRequestPriceMjtKcs9: Witnet.PriceTickerRequest(
        sources, { 
            "kucoin.com/ticker#9": ["MJT", "KCS"],
            "mojitoswap/ticker#9": ["0xa0d7c8aa789362cdf4faae24b9d1528ed5a3777f", "1"] 
        }
    ),
    
    WitnetRequestPriceMntUsdt6: Witnet.PriceTickerRequest(
        sources, {
            "bitmart.com/ticker": ["MNT", "USDT"], 
            "gateapi.io/ticker": ["mnt", "usdt"],
            "mexc.com/ticker": ["MNT", "USDT"], 
        }
    ),
    
    WitnetRequestPriceMtrUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "gateapi.io/ticker": ["mtr", "usdt"], 
            "mexc.com/ticker": ["MTR", "USDT"] 
        }
    ),
    
    WitnetRequestPriceMtrgUsdt6: Witnet.PriceTickerRequest(
        sources, { 
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
    
    WitnetRequestPriceOkbUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "gateapi.io/ticker": ["okb", "usdt"], 
            "okx.com/ticker": ["OKB", "USDT"], 
            "mexc.com/ticker": ["OKB", "USDT"] 
        }
    ),
    
    WitnetRequestPriceOktUsdt6: Witnet.PriceTickerRequest(
        sources, { 
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
        sources, { 
            "okx.com/ticker": ["OP", "USDT"],
            "binance.com/ticker": ["OP", "USDT"], 
            "digifinex.com/ticker": ["op", "usdt"], 
            "gateapi.io/ticker": ["op", "usdt"], 
            "kucoin.com/ticker": ["OP", "USDT"],  
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

    WitnetRequestPriceReefUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.com/ticker": ["REEF", "USDT"],
            "bitrue.com/ticker": ["REEFUSDT"], 
            "digifinex.com/ticker": ["reef", "usdt"],
            "gateapi.io/ticker": ["reef", "usdt"], 
            "kucoin.com/ticker": ["REEF", "USDT"], 
        }
    ),
    
    WitnetRequestPriceSaxUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "mojitoswap/ticker": ["0x1162131b63d95210acf5b3419d38c68492f998cc", "0"] 
        }
    ),
    
    WitnetRequestPriceShibUsd9: Witnet.PriceTickerRequest(
        sources, { 
            "coinbase.com/ticker#9": ["SHIB", "USD"], 
            "gateapi.io/ticker#9": ["shib", "usd"], 
            "kraken.com/ticker#9": ["SHIB", "USD"] 
        }
    ),
    
    WitnetRequestPriceSolUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "coinbase.com/ticker": ["SOL", "USD"], 
            "kraken.com/ticker": ["SOL", "USD"] 
        }
    ),
    
    WitnetRequestPriceStellaUsdt6: Witnet.RequestFromTemplate(
        templates['WitnetRequestTemplateStellaswapTicker6'], [
            ["0x81e11a9374033d11cc7e7485a7192ae37d0795d6", "1"]
        ]
    ),
    
    WitnetRequestPriceSysUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.com/ticker": ["SYS", "USDT"],
            "bitget.com/ticker": ["SYSUSDT_SPBL"], 
            "digifinex.com/ticker": ["sys", "usdt"],
            "gateapi.io/ticker#9": ["sys", "usdt"],
            "kucoin.com/ticker": ["SYS", "USDT"], 
            "mexc.com/ticker": ["SYS", "USDT"] 
        }
    ),
    
    WitnetRequestPriceTusdUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.com/ticker": ["TUSD", "USDT"], 
            "huobi.pro/ticker": ["tusd", "usdt"],
        }
    ),
    
    WitnetRequestPriceUlxUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "uniswap-v3/ticker": ["0x9adf4617804c762f86fc4e706ad0424da3b100a7", "1"] 
        }
    ),
    
    WitnetRequestPriceUniUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "bitfinex.com/ticker": ["uni", "usd"], 
            "bitstamp.net/ticker": ["uni", "usd"], 
            "coinbase.com/ticker": ["UNI", "USD"], 
            "gemini.com/ticker": ["uni", "usd"], 
            "kraken.com/ticker": ["UNI", "USD"] 
        }
    ),
    
    WitnetRequestPriceUsdcUsd6: Witnet.PriceTickerRequest(
        sources, {
            "bitstamp.net/ticker": ["usdc", "usd"], 
            "gemini.com/ticker": ["usdc", "usd"], 
            "kraken.com/ticker": ["USDC", "USD"] 
        }
    ),
    
    WitnetRequestPriceUsdtUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "kraken.com/ticker": ["USDT", "USD"],
            "binance.us/ticker": ["USDT", "USD"], 
            "bitstamp.net/ticker": ["usdt", "usd"], 
            "coinbase.com/ticker": ["USDT", "USD"], 
            "gemini.com/ticker": ["usdt", "usd"], 
        }
    ),
    
    WitnetRequestPriceVsqDai6: Witnet.RequestFromTemplate(
        templates['WitnetRequestTemplateSushiswapTicker6'], [
            ["0x5cf66ceaf7f6395642cd11b5929499229edef531", "1"]
        ]
    ),
    
    WitnetRequestPriceWbtcUsd6: Witnet.PriceTickerRequest(
        sources, {
            "bitfinex.com/ticker": ["wbt", "usd"], 
            "coinbase.com/ticker": ["WBTC", "USD"], 
            "kraken.com/ticker": ["WBTC", "USD"] 
        }
    ),
    
    WitnetRequestPriceWbtcWulx6: Witnet.PriceTickerRequest(
        sources, { 
            "ultron-dev.net/ticker": ["0xd2b86a80a8f30b83843e247a50ecdc8d843d87dd", "0x3a4f06431457de873b588846d139ec0d86275d54"] 
        }
    ),
    
    WitnetRequestPriceWethWulx6: Witnet.PriceTickerRequest(
        sources, { 
            "ultron-dev.net/ticker#inverse": ["0x2318bf5809a72aabadd15a3453a18e50bbd651cd", "0x3a4f06431457de873b588846d139ec0d86275d54"] 
        }
    ),
    
    WitnetRequestPriceWitUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "mexc.com/ticker": ["WIT", "USDT"],
            "bitmart.com/ticker": ["WIT", "USDT"], 
            "gateapi.io/ticker": ["wit", "usdt"],  
        }
    ),
    
    WitnetRequestPriceXlmUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "bitstamp.net/ticker": ["xlm", "usd"], 
            "coinbase.com/ticker": ["XLM", "USD"], 
            "kraken.com/ticker": ["XLM", "USD"] 
        }
    ),

};

