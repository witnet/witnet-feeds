const { utils, Witnet } = require("witnet-solidity")
const { legacy } = require("witnet-solidity/assets")

const retrievals = Witnet.RadonDictionary(Witnet.RadonRetrieval, require("../../retrievals"));
const templates = Witnet.RadonDictionary(Witnet.RadonTemplate, require("../../templates"));
const { PriceTickerRequest } = require("../../utils")

module.exports = {

    WitOracleRequestPriceAdaUsd6: PriceTickerRequest(
        retrievals, { 
            "ticker/bitstamp.net": ["ada", "usd"], 
            "ticker/coinbase.com": ["ADA", "USD"], 
            "ticker/kraken.com": ["ADA", "USD"],
        }
    ),
    
    WitOracleRequestPriceAlgoUsd6: PriceTickerRequest(
        retrievals, { 
            "ticker/bitstamp.net": ["algo", "usd"], 
            "ticker/coinbase.com": ["ALGO", "USD"], 
            "ticker/kraken.com": ["ALGO", "USD"], 
        }
    ),
    
    WitOracleRequestPriceApeUsd6: PriceTickerRequest(
        retrievals, { 
            "ticker/binance.us": ["APE", "USD"], 
            "ticker/coinbase.com": ["APE", "USD"], 
            "ticker/kraken.com": ["APE", "USD"],
        }
    ),
    
    WitOracleRequestPriceAtomUsd6: PriceTickerRequest(
        retrievals, { 
            "ticker/coinbase.com": ["ATOM", "USD"], 
            "ticker/kraken.com": ["ATOM", "USD"],
        }
    ),
    
    WitOracleRequestPriceAvaxUsd6: PriceTickerRequest(
        retrievals, { 
            "ticker/binance.us": ["AVAX", "USD"], 
            "ticker/bitstamp.net": ["avax", "usd"], 
            "ticker/coinbase.com": ["AVAX", "USD"],
            "ticker/gemini.com": ["avax", "usd"], 
            "ticker/kraken.com": ["AVAX", "USD"],
        }
    ),
    
    WitOracleRequestPriceBatUsdt6: PriceTickerRequest(
        retrievals, { 
            "ticker/binance.us": ["BAT", "USDT"], 
            "ticker/bitrue.com": ["BATUSDT"], 
            "ticker/coinbase.com": ["BAT", "USDT"], 
            "ticker/okx.com": ["BAT", "USDT"], 
            "ticker/upbit.com": ["BAT", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceBnbUsdt6: PriceTickerRequest(
        retrievals, { 
            "ticker/binance.com": ["BNB", "USDT"], 
            "ticker/bybit.com": ["BNB", "USDT", "inverse"], 
            "ticker/gateapi.io": ["bnb", "usdt"], 
            "ticker/huobi.pro": ["bnb", "usdt"], 
            "ticker/kucoin.com": ["BNB", "USDT"], 
            "ticker/okx.com": ["BNB", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceBobaUsdt6: PriceTickerRequest(
        retrievals, { 
            "ticker/gateapi.io": ["boba", "usdt"], 
            "ticker/huobi.pro": ["boba", "usdt"], 
            "ticker/mexc.com": ["BOBA", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceBoringUsdt6: PriceTickerRequest(
        retrievals, { 
            "ticker/gateapi.io": ["boring", "usdt"], 
            "ticker/huobi.pro": ["boring", "usdt"], 
            "ticker/mexc.com": ["BORING", "USDT"], 
            "ticker/okx.com": ["BORING", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceBtcUsd6: PriceTickerRequest(
        retrievals, { 
            "ticker/binance.us": ["BTC", "USD"], 
            "ticker/bitfinex.com": ["btc", "usd"], 
            "ticker/bitstamp.net": ["btc", "usd"], 
            "ticker/coinbase.com": ["BTC", "USD"], 
            "ticker/gemini.com": ["btc", "usd"], 
            "ticker/kraken.com": ["BTC", "USD"] 
        }
    ),
    
    WitOracleRequestPriceBusdUsdt6: PriceTickerRequest(
        retrievals, { 
            "ticker/binance.com": ["BUSD", "USDT"], 
        }
    ),
    
    WitOracleRequestPriceCeloEur6: PriceTickerRequest(
        retrievals, { 
            "ticker/bitvavo.com": ["CELO", "EUR"], 
            "ticker/coinbase.com": ["CGLD", "EUR"] 
        }
    ),
    
    WitOracleRequestPriceCeloUsd6: PriceTickerRequest(
        retrievals, { 
            "ticker/binance.us": ["CELO", "USD"], 
            "ticker/coinbase.com": ["CGLD", "USD"], 
            "ticker/okx.com": ["CELO", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceCfxUsdt6: PriceTickerRequest(
        retrievals, { 
            "ticker/binance.com": ["CFX", "USDT"], 
            "ticker/gateapi.io": ["cfx", "usdt"], 
            "ticker/kucoin.com": ["CFX", "USDT"], 
            "ticker/okx.com": ["CFX", "USDT"], 
            "ticker/mexc.com": ["CFX", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceCroUsdt6: PriceTickerRequest(
        retrievals, { 
            "ticker/coinbase.com": ["CRO", "USDT"], 
            "ticker/gateapi.io": ["cro", "usdt"], 
            "ticker/kucoin.com": ["CRO", "USDT"],
            "ticker/mexc.com": ["CRO", "USDT"],
            "ticker/okx.com": ["CRO", "USDT"], 
        }
    ),
    
    WitOracleRequestPriceDaiUsd6: PriceTickerRequest(
        retrievals, { 
            "ticker/binance.us": ["DAI", "USD"], 
            "ticker/bitstamp.net": ["dai", "usd"], 
            "ticker/coinbase.com": ["DAI", "USD"], 
            "ticker/gateapi.io": ["dai", "usd"],
            "ticker/gemini.com": ["dai", "usd"], 
            "ticker/kraken.com": ["DAI", "USD"], 
        }
    ),
    
    WitOracleRequestPriceDogeUsd6: PriceTickerRequest(
        retrievals, { 
            "ticker/binance.us": ["DOGE", "USD"], 
            "ticker/coinbase.com": ["DOGE", "USD"], 
            "ticker/kraken.com": ["DOGE", "USD"] 
        }
    ),
    
    WitOracleRequestPriceDotUsd6: PriceTickerRequest(
        retrievals, { 
            "ticker/bittrex.com": ["DOT", "USD"], 
            "ticker/coinbase.com": ["DOT", "USD"], 
            "ticker/kraken.com": ["DOT", "USD"] 
        }
    ),
    
    WitOracleRequestPriceElaUsdt6: PriceTickerRequest(
        retrievals, { 
            "ticker/gateapi.io": ["ela", "usdt"], 
            "ticker/huobi.pro": ["ela", "usdt"], 
            "ticker/kucoin.com": ["ELA", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceElonUsdt9: PriceTickerRequest(
        retrievals, { 
            "ticker/gateapi.io#9": ["elon", "usdt"], 
            "ticker/huobi.pro#9": ["elon", "usdt"], 
            "ticker/kucoin.com#9": ["ELON", "USDT"], 
            "ticker/mexc.com#9": ["ELON", "USDT"], 
            "ticker/okx.com#9": ["ELON", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceEosUsd6: PriceTickerRequest(
        retrievals, { 
            "ticker/ascendex.com": ["EOS", "USD"],
            "ticker/bitfinex.com": ["eos", "usd"], 
            "ticker/coinbase.com": ["EOS", "USD"], 
            "ticker/kraken.com": ["EOS", "USD"] 
        }
    ),
    
    WitOracleRequestPriceEthUsd6: PriceTickerRequest(
        retrievals, { 
            "ticker/binance.us": ["ETH", "USD"], 
            "ticker/bitfinex.com": ["eth", "usd"], 
            "ticker/bitstamp.net": ["eth", "usd"], 
            "ticker/coinbase.com": ["ETH", "USD"], 
            "ticker/kraken.com": ["ETH", "USD"],
            "ticker/gemini.com": ["eth", "usd"],  
        }
    ),
    
    WitOracleRequestPriceFraxUsdt6: PriceTickerRequest(
        retrievals, { 
            "ticker/gateapi.io": ["frax", "usdt"],
        }
    ), 
    
    WitOracleRequestPriceFtmUsdt6: PriceTickerRequest(
        retrievals, { 
            "ticker/binance.com": ["FTM", "USDT"], 
            "ticker/bybit.com": ["FTM", "USDT", "inverse"], 
            "ticker/digifinex.com": ["ftm", "usdt"], 
            "ticker/gateapi.io": ["ftm", "usdt"], 
            "ticker/huobi.pro": ["ftm", "usdt"], 
            "ticker/kucoin.com": ["FTM", "USDT"], 
            "ticker/mexc.com": ["FTM", "USDT"],
            "ticker/okx.com": ["FTM", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceFuseUsdt6: PriceTickerRequest(
        retrievals, { 
            "ticker/ascendex.com": ["FUSE", "USDT"], 
            "ticker/gateapi.io": ["fuse", "usdt"],
            "ticker/huobi.pro": ["fuse", "usdt"], 
            "ticker/mexc.com": ["FUSE", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceGlintUsdc6: templates.WitOracleRequestTemplateBeamswapTicker6
        .buildRequest(
            ["0x61b4cec9925b1397b64dece8f898047eed0f7a07", "0"]
        ),
    
    WitOracleRequestPriceGlmrUsdt6: PriceTickerRequest(
        retrievals, { 
            "ticker/binance.com": ["GLMR", "USDT"], 
            "ticker/gateapi.io": ["glmr", "usdt"], 
            "ticker/kucoin.com": ["GLMR", "USDT"], 
            "ticker/mexc.com": ["GLMR", "USDT"], 
            "ticker/okx.com": ["GLMR", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceHtUsdt6: PriceTickerRequest(
        retrievals, { 
            // "ticker/ascendex.com": ["HT", "USDT"], 
            "ticker/gateapi.io": ["ht", "usdt"], 
            // "ticker/huobi.pro": ["ht", "usdt"], 
            // "ticker/mexc.com": ["HT", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceImmoMcusd6: templates.WitOracleRequestTemplateUbeswapTicker6
        .buildRequest(
            ["0x7d63809ebf83ef54c7ce8ded3591d4e8fc2102ee", "0"],
        ),

    WitOracleRequestPriceKaiaUsdt6: PriceTickerRequest(
        retrievals, { 
            "ticker/binance.com": ["KAIA", "USDT"], 
            "ticker/bitget.com#v2": ["KAIA", "USDT"],
            "ticker/bybit.com": ["KAIA", "USDT", "spot"], 
            "ticker/okx.com": ["KAIA", "USDT"], 
            "ticker/gateapi.io": ["kaia", "usdt"], 
        }
    ),
    
    WitOracleRequestPriceKavaUsdt6: PriceTickerRequest(
        retrievals, { 
            "ticker/binance.com": ["KAVA", "USDT"], 
            "ticker/gateapi.io": ["kava", "usdt"], 
            "ticker/huobi.pro": ["kava", "usdt"], 
            "ticker/kucoin.com": ["KAVA", "USDT"], 
            "ticker/mexc.com": ["KAVA", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceKcsUsdt6: PriceTickerRequest(
        retrievals, { 
            "ticker/ascendex.com": ["KCS", "USDT"], 
            "ticker/kucoin.com": ["KCS", "USDT"], 
            "ticker/mexc.com": ["KCS", "USDT"], 
            "ticker/mojitoswap": ["0xb3b92d6b2656f9ceb4a381718361a21bf9b82bd9", "0"] 
        }
    ),
    
    WitOracleRequestPriceKspKrw6: PriceTickerRequest(
        retrievals, { 
            "ticker/coinone.co.kr": ["krw", "ksp"], 
            "ticker/korbit.co.kr": ["ksp", "krw"] 
        }
    ),
    
    WitOracleRequestPriceLinkUsd6: PriceTickerRequest(
        retrievals, { 
            "ticker/bitstamp.net": ["link", "usd"], 
            "ticker/coinbase.com": ["LINK", "USD"], 
            "ticker/kraken.com": ["LINK", "USD"] 
        }
    ),
    
    WitOracleRequestPriceMaticUsd6: PriceTickerRequest(
        retrievals, { 
            "ticker/binance.us": ["MATIC", "USD"], 
            "ticker/bitstamp.net": ["matic", "usd"], 
            "ticker/coinbase.com": ["MATIC", "USD"], 
            "ticker/kraken.com": ["MATIC", "USD"] 
        }
    ),
    
    WitOracleRequestPriceMetisUsdt6: PriceTickerRequest(
        retrievals, { 
            "ticker/gateapi.io": ["metis", "usdt"], 
            "ticker/kucoin.com": ["METIS", "USDT"], 
            "ticker/mexc.com": ["METIS", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceMjtKcs9: PriceTickerRequest(
        retrievals, { 
            "ticker/mojitoswap#9": ["0xa0d7c8aa789362cdf4faae24b9d1528ed5a3777f", "1"] 
        }
    ),
    
    WitOracleRequestPriceMntUsdt6: PriceTickerRequest(
        retrievals, {
            "ticker/bitmart.com": ["MNT", "USDT"], 
            "ticker/gateapi.io": ["mnt", "usdt"],
            "ticker/mexc.com": ["MNT", "USDT"], 
        }
    ),
    
    WitOracleRequestPriceMtrUsdt6: PriceTickerRequest(
        retrievals, { 
            "ticker/gateapi.io": ["mtr", "usdt"], 
            "ticker/mexc.com": ["MTR", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceMtrgUsdt6: PriceTickerRequest(
        retrievals, { 
            "ticker/gateapi.io": ["mtrg", "usdt"], 
            "ticker/kucoin.com": ["MTRG", "USDT"], 
            "ticker/mexc.com": ["MTRG", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceNctCelo6: templates.WitOracleRequestTemplateUniswapCeloTicker6
        .buildRequest(
            ["0xdb24905b1b080f65dedb0ad978aad5c76363d3c6", "1"]
        ),
    
    WitOracleRequestPriceOkbUsdt6: PriceTickerRequest(
        retrievals, { 
            "ticker/gateapi.io": ["okb", "usdt"], 
            "ticker/okx.com": ["OKB", "USDT"], 
            "ticker/mexc.com": ["OKB", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceOktUsdt6: PriceTickerRequest(
        retrievals, { 
            "ticker/gateapi.io": ["okt", "usdt"], 
            "ticker/okx.com": ["OKT", "USDT"], 
            "ticker/mexc.com": ["OKT", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceOloUsdc6: templates.WitOracleRequestTemplateOolongTicker6
        .buildRequest(
            ["0x5008f837883ea9a07271a1b5eb0658404f5a9610", "0x66a2a913e447d6b4bf33efbec43aaef87890fbbc"],
        ),
    
    WitOracleRequestPriceOpUsdt6: PriceTickerRequest(
        retrievals, { 
            "ticker/okx.com": ["OP", "USDT"],
            "ticker/binance.com": ["OP", "USDT"], 
            "ticker/digifinex.com": ["op", "usdt"], 
            "ticker/gateapi.io": ["op", "usdt"], 
            "ticker/kucoin.com": ["OP", "USDT"],  
        }
    ),
    
    WitOracleRequestPriceQuickUsdc6: templates.WitOracleRequestTemplateQuickswapTicker6
        .buildRequest(
            ["0x022df0b3341b3a0157eea97dd024a93f7496d631", "0"],
        ),
    
    WitOracleRequestPriceQuickWeth9: templates.WitOracleRequestTemplateQuickswapTicker9
        .buildRequest(
            ["0xde2d1fd2e8238aba80a5b80c7262e4833d92f624", "0"]
        ),
    
    WitOracleRequestPriceQuickWmatic6: templates.WitOracleRequestTemplateQuickswapTicker6
        .buildRequest(
            ["0x9f1a8caf3c8e94e43aa64922d67dff4dc3e88a42", "0"],
        ),

    WitOracleRequestPriceReefUsdt6: PriceTickerRequest(
        retrievals, { 
            "ticker/binance.com": ["REEF", "USDT"],
            "ticker/bitrue.com": ["REEFUSDT"], 
            "ticker/digifinex.com": ["reef", "usdt"],
            "ticker/gateapi.io": ["reef", "usdt"], 
            "ticker/kucoin.com": ["REEF", "USDT"], 
        }
    ),
    
    WitOracleRequestPriceSaxUsdt6: PriceTickerRequest(
        retrievals, { 
            "ticker/mojitoswap": ["0x1162131b63d95210acf5b3419d38c68492f998cc", "0"] 
        }
    ),
    
    WitOracleRequestPriceShibUsd9: PriceTickerRequest(
        retrievals, { 
            "ticker/coinbase.com#9": ["SHIB", "USD"], 
            "ticker/gateapi.io#9": ["shib", "usd"], 
            "ticker/kraken.com#9": ["SHIB", "USD"] 
        }
    ),
    
    WitOracleRequestPriceSolUsd6: PriceTickerRequest(
        retrievals, { 
            "ticker/coinbase.com": ["SOL", "USD"], 
            "ticker/kraken.com": ["SOL", "USD"] 
        }
    ),
    
    WitOracleRequestPriceStellaUsdt6: templates.WitOracleRequestTemplateStellaswapTicker6
        .buildRequest(
            ["0x81e11a9374033d11cc7e7485a7192ae37d0795d6", "1"],
        ),
    
    WitOracleRequestPriceSysUsdt6: PriceTickerRequest(
        retrievals, { 
            "ticker/binance.com": ["SYS", "USDT"],
            "ticker/bitget.com": ["SYSUSDT_SPBL"], 
            "ticker/digifinex.com": ["sys", "usdt"],
            "ticker/gateapi.io#9": ["sys", "usdt"],
            "ticker/kucoin.com": ["SYS", "USDT"], 
            "ticker/mexc.com": ["SYS", "USDT"] 
        }
    ),
    
    WitOracleRequestPriceTusdUsdt6: PriceTickerRequest(
        retrievals, { 
            "ticker/binance.com": ["TUSD", "USDT"], 
            "ticker/huobi.pro": ["tusd", "usdt"],
        }
    ),
    
    WitOracleRequestPriceUlxUsdt6: PriceTickerRequest(
        retrievals, { 
            "ticker/uniswap#v3": ["0x9adf4617804c762f86fc4e706ad0424da3b100a7", "1"] 
        }
    ),
    
    WitOracleRequestPriceUniUsd6: PriceTickerRequest(
        retrievals, { 
            "ticker/bitfinex.com": ["uni", "usd"], 
            "ticker/bitstamp.net": ["uni", "usd"], 
            "ticker/coinbase.com": ["UNI", "USD"], 
            "ticker/gemini.com": ["uni", "usd"], 
            "ticker/kraken.com": ["UNI", "USD"] 
        }
    ),
    
    WitOracleRequestPriceUsdcUsd6: PriceTickerRequest(
        retrievals, {
            "ticker/bitstamp.net": ["usdc", "usd"], 
            "ticker/gemini.com": ["usdc", "usd"], 
            "ticker/kraken.com": ["USDC", "USD"] 
        }
    ),
    
    WitOracleRequestPriceUsdtUsd6: PriceTickerRequest(
        retrievals, { 
            "ticker/kraken.com": ["USDT", "USD"],
            "ticker/binance.us": ["USDT", "USD"], 
            "ticker/bitstamp.net": ["usdt", "usd"], 
            "ticker/coinbase.com": ["USDT", "USD"], 
            "ticker/gemini.com": ["usdt", "usd"], 
        }
    ),
    
    WitOracleRequestPriceVsqDai6: templates.WitOracleRequestTemplateSushiswapTicker6
        .buildRequest(
            ["0x5cf66ceaf7f6395642cd11b5929499229edef531", "1"],
        ),
    
    WitOracleRequestPriceWbtcUsd6: PriceTickerRequest(
        retrievals, {
            "ticker/bitfinex.com": ["wbt", "usd"], 
            "ticker/coinbase.com": ["WBTC", "USD"], 
            "ticker/kraken.com": ["WBTC", "USD"] 
        }
    ),
    
    WitOracleRequestPriceWbtcWulx6: PriceTickerRequest(
        retrievals, { 
            "ticker/ultron-dev.net": [
                "0xd2b86a80a8f30b83843e247a50ecdc8d843d87dd", 
                "0x3a4f06431457de873b588846d139ec0d86275d54"
            ],
        }
    ),
    
    WitOracleRequestPriceWethWulx6: PriceTickerRequest(
        retrievals, { 
            "ticker/ultron-dev.net#inverse": [
                "0x2318bf5809a72aabadd15a3453a18e50bbd651cd", 
                "0x3a4f06431457de873b588846d139ec0d86275d54"
            ],
        }
    ),
    
    WitOracleRequestPriceWitUsdt6: PriceTickerRequest(
        retrievals, { 
            "ticker/mexc.com": ["WIT", "USDT"],
            "ticker/bitmart.com": ["WIT", "USDT"], 
            "ticker/gateapi.io": ["wit", "usdt"],  
        }
    ),

    WitOracleRequestPriceWldUsdt6: PriceTickerRequest(
        retrievals, {
            "ticker/binance.com": ["WLD", "USDT"],
            "ticker/bitget.com": ["WLDUSDT_SPBL"], 
            "ticker/bitmart.com": ["WLD", "USDT"], 
            "ticker/bybit.com": ["WLD", "USDT", "inverse"], 
            "ticker/gateapi.io": ["wld", "usdt"], 
            "ticker/kucoin.com": ["WLD", "USDT"], 
            "ticker/mexc.com": ["WLD", "USDT"],
            "ticker/okx.com": ["WLD", "USDT"], 
        }
    ),
    
    WitOracleRequestPriceXlmUsd6: PriceTickerRequest(
        retrievals, { 
            "ticker/bitstamp.net": ["xlm", "usd"], 
            "ticker/coinbase.com": ["XLM", "USD"], 
            "ticker/kraken.com": ["XLM", "USD"] 
        }
    ),

};
