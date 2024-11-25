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

    WitOracleRequestPriceAdaUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "bitstamp.net/ticker": ["ada", "usd"], 
            "coinbase.com/ticker": ["ADA", "USD"], 
            "kraken.com/ticker": ["ADA", "USD"],
        }
    ),
    
    WitOracleRequestPriceAlgoUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "bitstamp.net/ticker": ["algo", "usd"], 
            "coinbase.com/ticker": ["ALGO", "USD"], 
            "kraken.com/ticker": ["ALGO", "USD"], 
        }
    ),
    
    WitOracleRequestPriceApeUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.us/ticker": ["APE", "USD"], 
            "coinbase.com/ticker": ["APE", "USD"], 
            "kraken.com/ticker": ["APE", "USD"],
        }
    ),
    
    WitOracleRequestPriceAtomUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "coinbase.com/ticker": ["ATOM", "USD"], 
            "kraken.com/ticker": ["ATOM", "USD"],
        }
    ),
    
    WitOracleRequestPriceAvaxUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.us/ticker": ["AVAX", "USD"], 
            "bitstamp.net/ticker": ["avax", "usd"], 
            "coinbase.com/ticker": ["AVAX", "USD"],
            "gemini.com/ticker": ["avax", "usd"], 
            "kraken.com/ticker": ["AVAX", "USD"],
            }
        ),
    
    WitOracleRequestPriceBatUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.us/ticker": ["BAT", "USDT"], 
            "bitrue.com/ticker": ["BATUSDT"], 
            "coinbase.com/ticker": ["BAT", "USDT"], 
            "okx.com/ticker": ["BAT", "USDT"], 
            "upbit.com/ticker": ["BAT", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceBnbUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.com/ticker": ["BNB", "USDT"], 
            "bybit.com/ticker": ["BNB", "USDT", "inverse"], 
            "gateapi.io/ticker": ["bnb", "usdt"], 
            "huobi.pro/ticker": ["bnb", "usdt"], 
            "kucoin.com/ticker": ["BNB", "USDT"], 
            "okx.com/ticker": ["BNB", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceBobaUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "gateapi.io/ticker": ["boba", "usdt"], 
            "huobi.pro/ticker": ["boba", "usdt"], 
            "mexc.com/ticker": ["BOBA", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceBoringUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "gateapi.io/ticker": ["boring", "usdt"], 
            "huobi.pro/ticker": ["boring", "usdt"], 
            "mexc.com/ticker": ["BORING", "USDT"], 
            "okx.com/ticker": ["BORING", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceBtcUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.us/ticker": ["BTC", "USD"], 
            "bitfinex.com/ticker": ["btc", "usd"], 
            "bitstamp.net/ticker": ["btc", "usd"], 
            "coinbase.com/ticker": ["BTC", "USD"], 
            "gemini.com/ticker": ["btc", "usd"], 
            "kraken.com/ticker": ["BTC", "USD"] 
        }
    ),
    
    WitOracleRequestPriceBusdUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.com/ticker": ["BUSD", "USDT"], 
        }
    ),
    
    WitOracleRequestPriceCeloEur6: Witnet.PriceTickerRequest(
        sources, { 
            "bitvavo.com/ticker": ["CELO", "EUR"], 
            "coinbase.com/ticker": ["CGLD", "EUR"] 
        }
    ),
    
    WitOracleRequestPriceCeloUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.us/ticker": ["CELO", "USD"], 
            "coinbase.com/ticker": ["CGLD", "USD"], 
            "okx.com/ticker": ["CELO", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceCfxUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.com/ticker": ["CFX", "USDT"], 
            "gateapi.io/ticker": ["cfx", "usdt"], 
            "kucoin.com/ticker": ["CFX", "USDT"], 
            "okx.com/ticker": ["CFX", "USDT"], 
            "mexc.com/ticker": ["CFX", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceCroUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "coinbase.com/ticker": ["CRO", "USDT"], 
            "gateapi.io/ticker": ["cro", "usdt"], 
            "kucoin.com/ticker": ["CRO", "USDT"],
            "mexc.com/ticker": ["CRO", "USDT"],
            "okx.com/ticker": ["CRO", "USDT"], 
        }
    ),
    
    WitOracleRequestPriceDaiUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.us/ticker": ["DAI", "USD"], 
            "bitstamp.net/ticker": ["dai", "usd"], 
            "coinbase.com/ticker": ["DAI", "USD"], 
            "gateapi.io/ticker": ["dai", "usd"],
            "gemini.com/ticker": ["dai", "usd"], 
            "kraken.com/ticker": ["DAI", "USD"], 
        }
    ),
    
    WitOracleRequestPriceDogeUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.us/ticker": ["DOGE", "USD"], 
            "coinbase.com/ticker": ["DOGE", "USD"], 
            "kraken.com/ticker": ["DOGE", "USD"] 
        }
    ),
    
    WitOracleRequestPriceDotUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "bittrex.com/ticker": ["DOT", "USD"], 
            "coinbase.com/ticker": ["DOT", "USD"], 
            "kraken.com/ticker": ["DOT", "USD"] 
        }
    ),
    
    WitOracleRequestPriceElaUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "gateapi.io/ticker": ["ela", "usdt"], 
            "huobi.pro/ticker": ["ela", "usdt"], 
            "kucoin.com/ticker": ["ELA", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceElonUsdt9: Witnet.PriceTickerRequest(
        sources, { 
            "gateapi.io/ticker#9": ["elon", "usdt"], 
            "huobi.pro/ticker#9": ["elon", "usdt"], 
            "kucoin.com/ticker#9": ["ELON", "USDT"], 
            "mexc.com/ticker#9": ["ELON", "USDT"], 
            "okx.com/ticker#9": ["ELON", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceEosUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "ascendex.com/ticker": ["EOS", "USD"],
            "bitfinex.com/ticker": ["eos", "usd"], 
            "coinbase.com/ticker": ["EOS", "USD"], 
            "kraken.com/ticker": ["EOS", "USD"] 
        }
    ),
    
    WitOracleRequestPriceEthUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.us/ticker": ["ETH", "USD"], 
            "bitfinex.com/ticker": ["eth", "usd"], 
            "bitstamp.net/ticker": ["eth", "usd"], 
            "coinbase.com/ticker": ["ETH", "USD"], 
            "kraken.com/ticker": ["ETH", "USD"],
            "gemini.com/ticker": ["eth", "usd"],  
        }
    ),
    
    WitOracleRequestPriceFraxUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "gateapi.io/ticker": ["frax", "usdt"],
        }
    ), 
    
    WitOracleRequestPriceFtmUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.com/ticker": ["FTM", "USDT"], 
            "bybit.com/ticker": ["FTM", "USDT", "inverse"], 
            "digifinex.com/ticker": ["ftm", "usdt"], 
            "gateapi.io/ticker": ["ftm", "usdt"], 
            "huobi.pro/ticker": ["ftm", "usdt"], 
            "kucoin.com/ticker": ["FTM", "USDT"], 
            "mexc.com/ticker": ["FTM", "USDT"],
            "okx.com/ticker": ["FTM", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceFuseUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "ascendex.com/ticker": ["FUSE", "USDT"], 
            "gateapi.io/ticker": ["fuse", "usdt"],
            "huobi.pro/ticker": ["fuse", "usdt"], 
            "mexc.com/ticker": ["FUSE", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceGlintUsdc6: Witnet.RequestFromTemplate(
        templates['WitOracleRequestTemplateBeamswapTicker6'], [
            ["0x61b4cec9925b1397b64dece8f898047eed0f7a07", "0"]
        ]
    ),
    
    WitOracleRequestPriceGlmrUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.com/ticker": ["GLMR", "USDT"], 
            "gateapi.io/ticker": ["glmr", "usdt"], 
            "kucoin.com/ticker": ["GLMR", "USDT"], 
            "mexc.com/ticker": ["GLMR", "USDT"], 
            "okx.com/ticker": ["GLMR", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceHtUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            // "ascendex.com/ticker": ["HT", "USDT"], 
            "gateapi.io/ticker": ["ht", "usdt"], 
            // "huobi.pro/ticker": ["ht", "usdt"], 
            // "mexc.com/ticker": ["HT", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceImmoMcusd6: Witnet.RequestFromTemplate(
        templates['WitOracleRequestTemplateUbeswapTicker6'], [
            ["0x7d63809ebf83ef54c7ce8ded3591d4e8fc2102ee", "0"]
        ]
    ),

    WitOracleRequestPriceKaiaUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.com/ticker": ["KAIA", "USDT"], 
            "bitget.com/ticker/v2": ["KAIA", "USDT"],
            "bybit.com/ticker": ["KAIA", "USDT", "spot"], 
            "okx.com/ticker": ["KAIA", "USDT"], 
            "gateapi.io/ticker": ["kaia", "usdt"], 
        }
    ),
    
    WitOracleRequestPriceKavaUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.com/ticker": ["KAVA", "USDT"], 
            "gateapi.io/ticker": ["kava", "usdt"], 
            "huobi.pro/ticker": ["kava", "usdt"], 
            "kucoin.com/ticker": ["KAVA", "USDT"], 
            "mexc.com/ticker": ["KAVA", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceKcsUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "ascendex.com/ticker": ["KCS", "USDT"], 
            "kucoin.com/ticker": ["KCS", "USDT"], 
            "mexc.com/ticker": ["KCS", "USDT"], 
            "mojitoswap/ticker": ["0xb3b92d6b2656f9ceb4a381718361a21bf9b82bd9", "0"] 
        }
    ),
    
    WitOracleRequestPriceKspKrw6: Witnet.PriceTickerRequest(
        sources, { 
            "coinone.co.kr/ticker": ["krw", "ksp"], 
            "korbit.co.kr/ticker": ["ksp", "krw"] 
        }
    ),
    
    WitOracleRequestPriceLinkUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "bitstamp.net/ticker": ["link", "usd"], 
            "coinbase.com/ticker": ["LINK", "USD"], 
            "kraken.com/ticker": ["LINK", "USD"] 
        }
    ),
    
    WitOracleRequestPriceMaticUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.us/ticker": ["MATIC", "USD"], 
            "bitstamp.net/ticker": ["matic", "usd"], 
            "coinbase.com/ticker": ["MATIC", "USD"], 
            "kraken.com/ticker": ["MATIC", "USD"] 
        }
    ),
    
    WitOracleRequestPriceMetisUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "gateapi.io/ticker": ["metis", "usdt"], 
            "kucoin.com/ticker": ["METIS", "USDT"], 
            "mexc.com/ticker": ["METIS", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceMjtKcs9: Witnet.PriceTickerRequest(
        sources, { 
            "mojitoswap/ticker#9": ["0xa0d7c8aa789362cdf4faae24b9d1528ed5a3777f", "1"] 
        }
    ),
    
    WitOracleRequestPriceMntUsdt6: Witnet.PriceTickerRequest(
        sources, {
            "bitmart.com/ticker": ["MNT", "USDT"], 
            "gateapi.io/ticker": ["mnt", "usdt"],
            "mexc.com/ticker": ["MNT", "USDT"], 
        }
    ),
    
    WitOracleRequestPriceMtrUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "gateapi.io/ticker": ["mtr", "usdt"], 
            "mexc.com/ticker": ["MTR", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceMtrgUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "gateapi.io/ticker": ["mtrg", "usdt"], 
            "kucoin.com/ticker": ["MTRG", "USDT"], 
            "mexc.com/ticker": ["MTRG", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceNctCelo6: Witnet.RequestFromTemplate(
        templates['WitOracleRequestTemplateUniswapCeloTicker6'], [
            ["0xdb24905b1b080f65dedb0ad978aad5c76363d3c6", "1"]
        ]
    ),
    
    WitOracleRequestPriceOkbUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "gateapi.io/ticker": ["okb", "usdt"], 
            "okx.com/ticker": ["OKB", "USDT"], 
            "mexc.com/ticker": ["OKB", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceOktUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "gateapi.io/ticker": ["okt", "usdt"], 
            "okx.com/ticker": ["OKT", "USDT"], 
            "mexc.com/ticker": ["OKT", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceOloUsdc6: Witnet.RequestFromTemplate(
        templates['WitOracleRequestTemplateOolongTicker6'], [
            ["0x5008f837883ea9a07271a1b5eb0658404f5a9610", "0x66a2a913e447d6b4bf33efbec43aaef87890fbbc"]
        ]
    ),
    
    WitOracleRequestPriceOpUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "okx.com/ticker": ["OP", "USDT"],
            "binance.com/ticker": ["OP", "USDT"], 
            "digifinex.com/ticker": ["op", "usdt"], 
            "gateapi.io/ticker": ["op", "usdt"], 
            "kucoin.com/ticker": ["OP", "USDT"],  
        }
    ),
    
    WitOracleRequestPriceQuickUsdc6: Witnet.RequestFromTemplate(
        templates['WitOracleRequestTemplateQuickswapTicker6'], [
            ["0x022df0b3341b3a0157eea97dd024a93f7496d631", "0"]
        ]
    ),
    
    WitOracleRequestPriceQuickWeth9: Witnet.RequestFromTemplate(
        templates['WitOracleRequestTemplateQuickswapTicker9'], [
            ["0xde2d1fd2e8238aba80a5b80c7262e4833d92f624", "0"]
        ]
    ),
    
    WitOracleRequestPriceQuickWmatic6: Witnet.RequestFromTemplate(
        templates['WitOracleRequestTemplateQuickswapTicker6'], [
            ["0x9f1a8caf3c8e94e43aa64922d67dff4dc3e88a42", "0"]
        ]
    ),

    WitOracleRequestPriceReefUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.com/ticker": ["REEF", "USDT"],
            "bitrue.com/ticker": ["REEFUSDT"], 
            "digifinex.com/ticker": ["reef", "usdt"],
            "gateapi.io/ticker": ["reef", "usdt"], 
            "kucoin.com/ticker": ["REEF", "USDT"], 
        }
    ),
    
    WitOracleRequestPriceSaxUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "mojitoswap/ticker": ["0x1162131b63d95210acf5b3419d38c68492f998cc", "0"] 
        }
    ),
    
    WitOracleRequestPriceShibUsd9: Witnet.PriceTickerRequest(
        sources, { 
            "coinbase.com/ticker#9": ["SHIB", "USD"], 
            "gateapi.io/ticker#9": ["shib", "usd"], 
            "kraken.com/ticker#9": ["SHIB", "USD"] 
        }
    ),
    
    WitOracleRequestPriceSolUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "coinbase.com/ticker": ["SOL", "USD"], 
            "kraken.com/ticker": ["SOL", "USD"] 
        }
    ),
    
    WitOracleRequestPriceStellaUsdt6: Witnet.RequestFromTemplate(
        templates['WitOracleRequestTemplateStellaswapTicker6'], [
            ["0x81e11a9374033d11cc7e7485a7192ae37d0795d6", "1"]
        ]
    ),
    
    WitOracleRequestPriceSysUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.com/ticker": ["SYS", "USDT"],
            "bitget.com/ticker": ["SYSUSDT_SPBL"], 
            "digifinex.com/ticker": ["sys", "usdt"],
            "gateapi.io/ticker#9": ["sys", "usdt"],
            "kucoin.com/ticker": ["SYS", "USDT"], 
            "mexc.com/ticker": ["SYS", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceTusdUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "binance.com/ticker": ["TUSD", "USDT"], 
            "huobi.pro/ticker": ["tusd", "usdt"],
        }
    ),
    
    WitOracleRequestPriceUlxUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "uniswap-v3/ticker": ["0x9adf4617804c762f86fc4e706ad0424da3b100a7", "1"] 
        }
    ),
    
    WitOracleRequestPriceUniUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "bitfinex.com/ticker": ["uni", "usd"], 
            "bitstamp.net/ticker": ["uni", "usd"], 
            "coinbase.com/ticker": ["UNI", "USD"], 
            "gemini.com/ticker": ["uni", "usd"], 
            "kraken.com/ticker": ["UNI", "USD"] 
        }
    ),
    
    WitOracleRequestPriceUsdcUsd6: Witnet.PriceTickerRequest(
        sources, {
            "bitstamp.net/ticker": ["usdc", "usd"], 
            "gemini.com/ticker": ["usdc", "usd"], 
            "kraken.com/ticker": ["USDC", "USD"] 
        }
    ),
    
    WitOracleRequestPriceUsdtUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "kraken.com/ticker": ["USDT", "USD"],
            "binance.us/ticker": ["USDT", "USD"], 
            "bitstamp.net/ticker": ["usdt", "usd"], 
            "coinbase.com/ticker": ["USDT", "USD"], 
            "gemini.com/ticker": ["usdt", "usd"], 
        }
    ),
    
    WitOracleRequestPriceVsqDai6: Witnet.RequestFromTemplate(
        templates['WitOracleRequestTemplateSushiswapTicker6'], [
            ["0x5cf66ceaf7f6395642cd11b5929499229edef531", "1"]
        ]
    ),
    
    WitOracleRequestPriceWbtcUsd6: Witnet.PriceTickerRequest(
        sources, {
            "bitfinex.com/ticker": ["wbt", "usd"], 
            "coinbase.com/ticker": ["WBTC", "USD"], 
            "kraken.com/ticker": ["WBTC", "USD"] 
        }
    ),
    
    WitOracleRequestPriceWbtcWulx6: Witnet.PriceTickerRequest(
        sources, { 
            "ultron-dev.net/ticker": ["0xd2b86a80a8f30b83843e247a50ecdc8d843d87dd", "0x3a4f06431457de873b588846d139ec0d86275d54"] 
        }
    ),
    
    WitOracleRequestPriceWethWulx6: Witnet.PriceTickerRequest(
        sources, { 
            "ultron-dev.net/ticker#inverse": ["0x2318bf5809a72aabadd15a3453a18e50bbd651cd", "0x3a4f06431457de873b588846d139ec0d86275d54"] 
        }
    ),
    
    WitOracleRequestPriceWitUsdt6: Witnet.PriceTickerRequest(
        sources, { 
            "mexc.com/ticker": ["WIT", "USDT"],
            "bitmart.com/ticker": ["WIT", "USDT"], 
            "gateapi.io/ticker": ["wit", "usdt"],  
        }
    ),

    WitOracleRequestPriceWldUsdt6: Witnet.PriceTickerRequest(
        sources, {
            "binance.com/ticker": ["WLD", "USDT"],
            "bitget.com/ticker": ["WLDUSDT_SPBL"], 
            "bitmart.com/ticker": ["WLD", "USDT"], 
            "bybit.com/ticker": ["WLD", "USDT", "inverse"], 
            "gateapi.io/ticker": ["wld", "usdt"], 
            "kucoin.com/ticker": ["WLD", "USDT"], 
            "mexc.com/ticker": ["WLD", "USDT"],
            "okx.com/ticker": ["WLD", "USDT"], 
        }
    ),
    
    WitOracleRequestPriceXlmUsd6: Witnet.PriceTickerRequest(
        sources, { 
            "bitstamp.net/ticker": ["xlm", "usd"], 
            "coinbase.com/ticker": ["XLM", "USD"], 
            "kraken.com/ticker": ["XLM", "USD"] 
        }
    ),

};

