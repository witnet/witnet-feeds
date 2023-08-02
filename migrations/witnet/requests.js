const priceTicker = {
  aggregator: "price-aggregator",
  tally: "price-tally",
}
module.exports = {
  price_feeds: {
    WitnetRequestPriceAdaUsd6: {
      ...priceTicker,
      retrievals: {
        "bitstamp/ticker": ["ada", "usd"], // bitstamp.net
        "bittrex/ticker": ["ADA", "USD"], // bittrex.com
        "coinbase/ticker": ["ADA", "USD"], // coinbase.com
        "kraken/ticker": ["ADA", "USD"], // kraken.com        
      },
    },
    WitnetRequestPriceAlgoUsd6: {
      ...priceTicker,
      retrievals: {
        "bitstamp/ticker": ["algo", "usd"], // bitstamp.net
        "bittrex/ticker": ["ALGO", "USD"], // bittrex.com
        "coinbase/ticker": ["ALGO", "USD"], // coinbase.com
        "kraken/ticker": ["ALGO", "USD"], // kraken.com        
      },
    },
    WitnetRequestPriceApeUsd6: {
      ...priceTicker,
      retrievals: {
        "binance.us/ticker": ["APE", "USD"], // binance.us
        "coinbase/ticker": ["APE", "USD"], // coinbase.com
        "kraken/ticker": ["APE", "USD"], // kraken.com        
      },
    },
    WitnetRequestPriceAtomUsd6: {
      ...priceTicker,
      retrievals: {
        "bittrex/ticker": ["ATOM", "USD"], // bittrex.com
        "coinbase/ticker": ["ATOM", "USD"], // coinbase.com
        "kraken/ticker": ["ATOM", "USD"], // kraken.com        
      },
    },
    WitnetRequestPriceAvaxUsd6: {
      ...priceTicker,
      retrievals: {
        "binance.us/ticker": ["AVAX", "USD"], // binance.us
        "bittrex/ticker": ["AVAX", "USD"], // bittrex.com
        "coinbase/ticker": ["AVAX", "USD"], // coinbase.com
        "kraken/ticker": ["AVAX", "USD"], // kraken.com        
      },
    },
    WitnetRequestPriceBatUsdt6: {
      ...priceTicker,
      retrievals: {
        "binance.us/ticker": ["BAT", "USDT"], // binance.us
        "bitrue/ticker": ["BATUSDT"], // bittrue.com
        "coinbase/ticker": ["BAT", "USDT"], // coinbase.com
        "okx/ticker": ["BAT", "USDT"], // okx.com
        "upbit/ticker": ["BAT", "USDT"], // upbit.com
      },
    },
    WitnetRequestPriceBnbUsdt6: {
      ...priceTicker,
      retrievals: {
        "binance.com/ticker": ["BNB", "USDT"], // binance.com
        "bybit/ticker": ["BNB", "USDT"], // bybit.com
        "gateio/ticker": ["bnb", "usdt"], // gateio.io
        "huobi/ticker": ["bnb", "usdt"], // huobi.pro
        "kucoin/ticker": ["BNB", "USDT"], // kucoin.com
        "okx/ticker": ["BNB", "USDT"], // okx.com
      },
    },
    WitnetRequestPriceBobaUsdt6: {
      ...priceTicker,
      retrievals: {
        "gateio/ticker": ["boba", "usdt"], // gateio.io
        "huobi/ticker": ["boba", "usdt"], // huobi.pro
        "mexc/ticker": ["BOBA", "USDT"], // mexc.com
      },
    },
    WitnetRequestPriceBoringUsdt6: {
      ...priceTicker,
      retrievals: {
        "gateio/ticker": ["boring", "usdt"], // gateio.io
        "huobi/ticker": ["boring", "usdt"], // huobi.pro
        "mexc/ticker": ["BORING", "USDT"], // mexc.com
        "okx/ticker": [ "BORING", "USDT" ], // okx.com
      },
    },
    WitnetRequestPriceBtcUsd6: {
      ...priceTicker,
      retrievals: {
        "binance.us/ticker": ["BTC", "USD"], // binance.us
        "bitfinex/ticker": ["btc", "usd"], // bitfinex.com
        "bitstamp/ticker": ["btc", "usd"], // bitstamp.net
        "bittrex/ticker": ["BTC", "USD"], // bittrex.com
        "coinbase/ticker": ["BTC", "USD"], // coinbase.com
        "kraken/ticker": ["BTC", "USD"], // kraken.com
      },
    },
    WitnetRequestPriceBusdUsdt6: {
      ...priceTicker,
      retrievals: {
        "binance.com/ticker": ["BUSD", "USDT"], // binance.com
        "bitmart/ticker": ["BUSD", "USDT"], // bitmart.com
        "kucoin/ticker": ["BUSD", "USDT"], // kucoin.com
        "indoex/ticker": ["BUSD", "USDT"], // indoex.io
      },
    },
    WitnetRequestPriceCeloEur6: {
      ...priceTicker,
      retrievals: {
        "bittrex/ticker": ["CELO", "EUR"], // bittrex.com
        "coinbase/ticker": ["CGLD", "EUR"], // coinbase.com
      },
    },
    WitnetRequestPriceCeloUsd6: {
      ...priceTicker,
      retrievals: {
        "binance.us/ticker": ["CELO", "USD"], // binance.us
        "coinbase/ticker": ["CGLD", "USD"], // coinbase.com
        "okx/ticker": [ "CELO", "USDT" ], // okx.com
      },
    },
    WitnetRequestPriceCfxUsdt6: {
      ...priceTicker,
      retrievals: {
        "binance.com/ticker": [ "CFX", "USDT"], // binance.com
        "gateio/ticker": ["cfx", "usdt"], // gateio.io
        "kucoin/ticker": ["CFX", "USDT"], // kucoin.com
        "okx/ticker": [ "CFX", "USDT" ], // okx.com
        "mexc/ticker": ["CFX", "USDT"], // mexc.com
      },
    },
    WitnetRequestPriceCroUsdt6: {
      ...priceTicker,
      retrievals: {
        "bittrex/ticker": ["CRO", "USDT"], // bittrex.com
        "coinbase/ticker": ["CRO", "USDT"], // coinbase.com
        "gateio/ticker": ["cro", "usdt"], // gateio.io
        "kucoin/ticker": ["CRO", "USDT"], // kucoin.com
      },
    },
    WitnetRequestPriceDaiUsd6: {
      ...priceTicker,
      retrievals: {
        "binance.us/ticker": ["DAI", "USD"], // binance.us
        "bitstamp/ticker": ["dai", "usd"], // bitstamp.net
        "bittrex/ticker": ["DAI", "USD"], // bittrex.com
        "kraken/ticker": ["DAI", "USD"], // kraken.com
        "gateio/ticker": ["dai", "usd"], // gateio.io
      },
    },
    WitnetRequestPriceDogeUsd6: {
      ...priceTicker,
      retrievals: {
        "binance.us/ticker": ["DOGE", "USD"], // binance.us
        "bittrex/ticker": ["DOGE", "USD"], // bittrex.com
        "coinbase/ticker": ["DOGE", "USD"], // coinbase.com
        "kraken/ticker": ["DOGE", "USD"], // kraken.com
      },
    },
    WitnetRequestPriceDotUsd6: {
      ...priceTicker,
      retrievals: {
        "bittrex/ticker": ["DOT", "USD"], // bittrex.com
        "coinbase/ticker": ["DOT", "USD"], // coinbase.com
        "kraken/ticker": ["DOT", "USD"], // kraken.com        
      },
    },
    WitnetRequestPriceElaUsdt6: {
      ...priceTicker,
      retrievals: {
        "gateio/ticker": ["ela", "usdt"], // gate.io
        "huobi/ticker": ["ela", "usdt"], // huobi.pro
        "kucoin/ticker": ["ELA", "USDT"], // kucoin.com
      },
    },
    WitnetRequestPriceElonUsdt9: {
      ...priceTicker,
      retrievals: {
        "gateio/ticker": ["elon", "usdt"], // gateio.io
        "huobi/ticker": ["elon", "usdt"], // huobi.pro
        "kucoin/ticker": [ "ELON", "USDT" ], // kucoin.com
        "mexc/ticker": ["ELON", "USDT"], // mexc.com
        "okx/ticker": [ "ELON", "USDT" ], // okx.com
      },
    },
    WitnetRequestPriceEosUsd6: {
      ...priceTicker,
      retrievals: {
        "bittrex/ticker": ["EOS", "USD"], // bittrex.com
        "coinbase/ticker": ["EOS", "USD"], // coinbase.com
        "kraken/ticker": ["EOS", "USD"], // kraken.com
      },
    },
    WitnetRequestPriceEthUsd6: {
      ...priceTicker,
      retrievals: {
        "binance.us/ticker": ["ETH", "USD"], // binance.us
        "bitfinex/ticker": ["eth", "usd"], // bitfinex.com
        "bitstamp/ticker": ["eth", "usd"], // bitstamp.net
        "bittrex/ticker": ["ETH", "USD"], // bittrex.com
        "coinbase/ticker": ["ETH", "USD"], // coinbase.com
        "kraken/ticker": ["ETH", "USD"], // kraken.com
      },
    },
    WitnetRequestPriceFraxUsdt6: {
      ...priceTicker,
      retrievals: {
        "gateio/ticker": ["frax", "usdt"], // gateio.io
        "subgraphs/name/uniswap/uniswap-v3": ["0xc2a856c3aff2110c1171b8f942256d40e980c726", "1"], // uniswap-v3
      },
    },
    WitnetRequestPriceFtmUsdt6: {
      ...priceTicker,
      retrievals: {
        "binance.com/ticker": ["FTM", "USDT"], // binance.com
        "bittrex/ticker": ["FTM", "USDT"], // bittrex.com
        "gateio/ticker": ["ftm", "usdt"], // gateio.io
        "huobi/ticker": ["ftm", "usdt"], // huobi.pro
        "kucoin/ticker": ["FTM", "USDT"], // kucoin.com
        "mexc/ticker": ["FTM", "USDT"], // mexc.com
      },
    },
    WitnetRequestPriceFuseUsdt6: {
      ...priceTicker,
      retrievals: {
        "ascendex/ticker": ["FUSE", "USDT"], // ascendex.com
        "gateio/ticker": ["fuse", "usdt"], // gateio.io
        "huobi/ticker": ["fuse", "usdt"], // huobi.pro
        "mexc/ticker": ["FUSE", "USDT"], // mexc.com
      },
    },
    WitnetRequestPriceGlintUsdc6: {
      args: [{
        pair_id: "0x61b4cec9925b1397b64dece8f898047eed0f7a07",
        token_id: "0",
      }],
      template: "WitnetRequestTemplateBeamswap",
    },
    WitnetRequestPriceGlmrUsdt6: {
      ...priceTicker,
      retrievals: {
        "binance.com/ticker": [ "GLMR", "USDT"], // binance.com
        "gateio/ticker": [ "glmr", "usdt" ], // gate.io
        "kucoin/ticker": [ "GLMR", "USDT" ], // kucoin.com
        "mexc/ticker": [ "GLMR", "USDT" ], // mexc.com
        "okx/ticker": [ "GLMR", "USDT" ], // okx.com
      },
    }, 
    WitnetRequestPriceHtUsdt6: {
      ...priceTicker,
      retrievals: {
        "ascendex/ticker": ["HT", "USDT"], // ascendex.com
        "gateio/ticker": ["ht", "usdt"], // gateio.io
        "huobi/ticker": ["ht", "usdt"], // huobi.pro
        "mexc/ticker": ["HT", "USDT"], // mexc.com
      },
    },
    WitnetRequestPriceImmoMcusd6: {
      args: [{
        pair_id: "0x7d63809ebf83ef54c7ce8ded3591d4e8fc2102ee",
        token_id: "0",
      }],
      template: "WitnetRequestTemplateOolongswap",
    },
    WitnetRequestPriceKavaUsdt6: {
      ...priceTicker,
      retrievals: {
        "binance.com/ticker": ["KAVA", "USDT"], // binance.com
        "gateio/ticker": ["kava", "usdt"], // gateio.io
        "huobi/ticker": ["kava", "usdt"], // huobi.pro
        "kucoin/ticker": ["KAVA", "USDT"], // kucoin.com
        "mexc/ticker": ["KAVA", "USDT"], // mexc.com
      },
    },
    WitnetRequestPriceKcsUsdt6: {
      ...priceTicker,
      retrievals: {
        "ascendex/ticker": [ "KCS", "USDT"], // ascendex.com
        "kucoin/ticker": ["KCS", "USDT"], // kucoin.com
        "mexc/ticker": ["KCS", "USDT"], // mexc.com
        "subgraphs/name/mojito/swap": ["0xb3b92d6b2656f9ceb4a381718361a21bf9b82bd9", "0"], // MojitoSwap
      },
    },
    WitnetRequestPriceKlayUsdt6: {
      ...priceTicker,
      retrievals: {
        "binance.com/ticker": ["KLAY", "USDT"], // binance.com
        "gateio/ticker": ["klay", "usdt"], // gateio.io
        "kucoin/ticker": ["KLAY", "USDT"], // kucoin.com
        "okx/ticker": ["KLAY", "USDT"], // okx.com
      },
    },
    WitnetRequestPriceKrwUsd9: {
      ...priceTicker,
      retrievals: {
        "exchangerate/ticker#9": ["KRW", "USD"], // exchangerate.host
        "fastforex/ticker#9": ["KRW", "USD"], // fastforex.io
        "jsdelivr/ticker#9": ["krw", "usd"], // jsdelivr.net
      },
    },
    WitnetRequestPriceKspKrw6: {
      ...priceTicker,
      retrievals: {
        "coinone/ticker": ["krw", "ksp"], // coinone.co.kr
        "coinone/ticker": ["krw", "ksp"], // coinone.co.kr
        "korbit/ticker": ["ksp", "krw"], // korbit.co.kr
      },
    },
    WitnetRequestPriceLinkUsd6: {
      ...priceTicker,
      retrievals: {
        "bitstamp/ticker": ["link", "usd"], // bitstamp.net
        "coinbase/ticker": ["LINK", "USD"], // coinbase.com
        "kraken/ticker": ["LINK", "USD"], // kraken.com
      },
    },
    WitnetRequestPriceMaticUsd6: {
      ...priceTicker,
      retrievals: {
        "binance.us/ticker": ["MATIC", "USD"], // binance.us
        "bitstamp/ticker": ["matic", "usd"], // bitstamp.net
        "coinbase/ticker": ["MATIC", "USD"], // coinbase.com
        "kraken/ticker": ["MATIC", "USD"], // kraken.com
      },
    },
    WitnetRequestPriceMetisUsdt6: {
      ...priceTicker,
      retrievals: {
        "gateio/ticker": ["metis", "usdt"], // gateio.io
        "kucoin/ticker": ["METIS", "USDT"], // kucoin.com
        "mexc/ticker": ["METIS", "USDT"], // mexc.com
      },
    },
    WitnetRequestPriceMjtKcs9: {
      ...priceTicker,
      retrievals: {
        "kucoin/ticker": ["MJT", "KCS"], // kucoin.com
        "subgraphs/name/mojito/swap": ["0xa0d7c8aa789362cdf4faae24b9d1528ed5a3777f", "1"], // MojitoSwap
      },
    },
    WitnetRequestPriceMtrUsdt6: {
      ...priceTicker,
      retrievals: {
        "gateio/ticker": ["mtr", "usdt"], // gateio.io
        "mexc/ticker": ["MTR", "USDT"], // mexc.com
      },
    },
    WitnetRequestPriceMtrgUsdt6: {
      ...priceTicker,
      retrievals: {
        "gateio/ticker": ["mtrg", "usdt"], // gateio.io
        "kucoin/ticker": ["MTRG", "USDT"], // kucoin.com
        "mexc/ticker": ["MTRG", "USDT"], // mexc.com
      },
    },
    WitnetRequestPriceNationUsdt6: {
      ...priceTicker,
      retrievals: {
        "mexc/ticker": ["NATION", "USDT"], // mexc.com
      },
    },
    WitnetRequestPriceNctCelo6: {
      args: [{
        pair_id: "0xdb24905b1b080f65dedb0ad978aad5c76363d3c6",
        token_id: "1",
      }],
      template: "WitnetRequestTemplateUniswapCelo",
    },
    WitnetRequestPriceOktUsdt6: {
      ...priceTicker,
      retrievals: {
        "gateio/ticker": ["okt", "usdt"], // gateio.io
        "okx/ticker": ["OKT", "USDT"], // okx.com
        "mexc/ticker": ["OKT", "USDT"], // mexc.com
      },
    },
    WitnetRequestPriceOloUsdc6: {
      args: [{
        token0: "0x5008f837883ea9a07271a1b5eb0658404f5a9610", // olo
        token1: "0x66a2a913e447d6b4bf33efbec43aaef87890fbbc", // usdc
      }],
      template: "WitnetRequestTemplateOolongswap",
    },
    WitnetRequestPriceOpUsdt6: {
      ...priceTicker,
      retrievals: {
        "binance.com/ticker": ["OP", "USDT"], // binance.us
        "bkex/ticker": ["OP", "USDT"], // bkex.com
        "digifinex/ticker": ["op", "usdt"], // digifinex.com
        "gateio/ticker": ["op", "usdt"], // gateio.io
        "kucoin/ticker": ["OP", "USDT"], // kucoin.com
        "okx/ticker": ["OP", "USDT"], // okx.com
      },
    },
    WitnetRequestPriceQuickUsdc6: {
      args: [{
        pair_id: "0x022df0b3341b3a0157eea97dd024a93f7496d631",
        token_id: "0",
      }],
      template: "WitnetRequestTemplateQuickswap",
    },
    WitnetRequestPriceQuickWeth9: {
      args: [{
        pair_id: "0xde2d1fd2e8238aba80a5b80c7262e4833d92f624",
        token_id: "0",
      }],
      template: "WitnetRequestTemplateQuickswap_9",
    },
    WitnetRequestPriceQuickWmatic6: {
      args: [{
        pair_id: "0x9f1a8caf3c8e94e43aa64922d67dff4dc3e88a42",
        token_id: "0",
      }],
      template: "WitnetRequestTemplateQuickswap",
    },
    WitnetRequestPriceSaxUsdt6: {
      ...priceTicker,
      retrievals: {
        "subgraphs/name/mojito/swap": ["0x1162131b63d95210acf5b3419d38c68492f998cc", "0"], // MojitoSwap
      },
    },
    WitnetRequestPriceShibUsd9: {
      ...priceTicker,
      retrievals: {
        "coinbase/ticker#9": ["SHIB", "USD"], // coinbase.com
        "gateio/ticker#9": ["shib", "usd"], // gateio.io
        "kraken/ticker#9": ["SHIB", "USD"], // kraken.com
      },
    },
    WitnetRequestPriceSolUsd6: {
      ...priceTicker,
      retrievals: {
        "coinbase/ticker": ["SOL", "USD"], // coinbase.com
        "kraken/ticker": ["SOL", "USD"], // kraken.com
      },
    },
    WitnetRequestPriceStellaUsdt6: {
      args: [{
        pair_id: "0x81e11a9374033d11cc7e7485a7192ae37d0795d6",
        token_id: "1"
      }],
      template: "WitnetRequestTemplateStellaSwap"
    },
    WitnetRequestPriceTusdUsdt6: {
      ...priceTicker,
      retrievals: {
        "binance.com/ticker": ["TUSD", "USDT"], // binance.us
        "bittrex/ticker": ["TUSD", "USDT"], // bittrex.com
        "huobi/ticker": ["tusd", "usdt"], // huobi.pro
      },
    },
    WitnetRequestPriceUlxUsdt6: {
      ...priceTicker,
      retrievals: {
        "subgraphs/name/uniswap/uniswap-v3": ["0x9adf4617804c762f86fc4e706ad0424da3b100a7", "1"], // uniswap-v3
      },
    },
    WitnetRequestPriceUniUsd6: {
      ...priceTicker,
      retrievals: {
        "bitfinex/ticker": ["uni", "usd"], // bitfinex.com
        "bitstamp/ticker": ["uni", "usd"], // bitstamp.net
        "coinbase/ticker": ["UNI", "USD"], // coinbase.com
        "gemini/ticker": ["uni", "usd"], // gemini.com
        "kraken/ticker": ["UNI", "USD"], // kraken.com
      },
    },
    WitnetRequestPriceUsdcUsd6: {
      ...priceTicker,
      retrievals: {
        "bitstamp/ticker": ["usdc", "usd"], // bitstamp.net
        "bittrex/ticker": ["USDC", "USD"], // bittrex.com
        "gemini/ticker": ["usdc", "usd"], // gemini.com
        "kraken/ticker": ["USDC", "USD"], // kraken.com
      },
    },
    WitnetRequestPriceUsdtUsd6: {
      ...priceTicker,
      retrievals: {
        "binance.us/ticker": ["USDT", "USD"], // binance.us
        "bitstamp/ticker": ["usdt", "usd"], // bitstamp.net
        "bittrex/ticker": ["USDT", "USD"], // bittrex.com
        "kraken/ticker": ["USDT", "USD"], // kraken.com
      },
    },
    WitnetRequestPriceVsqDai6: {
      args: [{
        pair_id: "0x5cf66ceaf7f6395642cd11b5929499229edef531",
        token_id: "1",
      }],
      template: "WitnetRequestTemplateMaticExchange",
    },
    WitnetRequestPriceWbtcUsd6: {
      ...priceTicker,
      retrievals: {
        "bitfinex/ticker": ["wbtc", "usd"], // bitfinex.com
        "coinbase/ticker": ["WBTC", "USD"], // coinbase.com
        "kraken/ticker": ["WBTC", "USD"], // kraken.com
      },
    },
    WitnetRequestPriceWbtcWulx6: {
      ...priceTicker,
      retrievals: {
        "ultron-dev/ticker": [ // ultron-dev.net
          "0xd2b86a80a8f30b83843e247a50ecdc8d843d87dd", // WBTC
          "0x3a4f06431457de873b588846d139ec0d86275d54", // WULX
        ], 
      },
    },
    WitnetRequestPriceWethWulx6: {
      ...priceTicker,
      retrievals: {
        "ultron-dev/ticker#inverse": [ // ultron-dev.net
          "0x2318bf5809a72aabadd15a3453a18e50bbd651cd", // WETH
          "0x3a4f06431457de873b588846d139ec0d86275d54", // WULX
        ], 
      },
    },
    WitnetRequestPriceWitUsdt6: {
      ...priceTicker,
      retrievals: {
        "bitmart/ticker": ["WIT", "USDT"], // bitmart.com
        "gateio/ticker": ["wit", "usdt"], // gateio.io
        "mexc/ticker": ["WIT", "USDT"], // mexc.com
      },
    },
    WitnetRequestPriceXlmUsd6: {
      ...priceTicker,
      retrievals: {
        "bitstamp/ticker": ["xlm", "usd"], // bitstamp.net
        "bittrex/ticker": ["XLM", "USD"], // bittrex.com
        "coinbase/ticker": ["XLM", "USD"], // coinbase.com
        "kraken/ticker": ["XLM", "USD"], // kraken.com
      },
    },
  },
  /// path: { ... path: {
  /// //// FORMULA 1 ////////////////////////////////////////////////////////////////////////
  ///     WitnetRequestXXX: {
  ///         args: [ [ .. ], ... ],
  ///         template: WitnetRequestTemplateYYY // within migrations/witnet/templates
  ///     },
  ///     // ...
  /// //// FORMULA 2 ////////////////////////////////////////////////////////////////////////
  ///     WitnetRequestZZZ: {
  ///         retrievals: {
  ///             'unique-resource-name':         // => within assets/witnet/radons.retrievals
  ///                 [ .. ]                      // => array of string arguments,
  ///             ...,
  ///         ],
  ///         aggregator: 'unique-resource-name'  // => within assets/witnet/radons.reducers
  ///         tally: 'unique-resource-name'       // => within assets/witnet/radons.reducers
  ///     },
  ///     // ...
  /// },
}
