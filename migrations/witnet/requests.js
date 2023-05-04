const priceTicker = {
    aggregator: 'price-aggregator',
    tally: 'price-tally',
}
module.exports = {
    price_feeds: {
        WitnetRequestPriceBatUsdt6: {
            ...priceTicker,
            retrievals: {
                'binance.us/ticker': [ "BAT", "USDT" ], // binance.us
                'bitrue/ticker': [ "BATUSDT" ], // bittrue.com
                'coinbase/ticker': [ "BAT", "USDT" ], // coinbase.com
                'okx/ticker': [ "BAT", "USDT" ], // okx.com
                'upbit/ticker': [ "BAT", "USDT" ], // upbit.com
            },
        },
        WitnetRequestPriceBnbUsdt6: {
            ...priceTicker,
            retrievals: {
                'binance.com/ticker': [ "BNB", "USDT" ], // binance.com
                'bybit/ticker': [ "BNB", "USDT" ], // bybit.com
                'gateio/ticker': [ "bnb", "usdt" ], // gateio.io
                'huobi/ticker': [ "bnb", "usdt" ], // huobi.pro
                'kucoin/ticker': [ "BNB", "USDT" ], // kucoin.com
                'okx/ticker': [ "BNB", "USDT" ], // okx.com
            },
        },
        WitnetRequestPriceBtcUsd6: {
            ...priceTicker,
            retrievals: {
                'binance.us/ticker': [ "BTC", "USD" ], // binance.us
                'bitfinex/ticker': [ "btc", "usd" ], // bitfinex.com
                'bitstamp/ticker': [ "btc", "usd" ], // bitstamp.net
                'bittrex/ticker': [ "BTC", "USD" ], // bittrex.com
                'coinbase/ticker': [ "BTC", "USD" ], // coinbase.com
                'kraken/ticker': [ "BTC", "USD" ], // kraken.com
            },
        },
        WitnetRequestPriceBusdUsdt6: {
            ...priceTicker,
            retrievals: {
                'binance.com/ticker': [ "BUSD", "USDT" ], // binance.com
                'bitmart/ticker': [ "BUSD", "USDT" ], // bitmart.com
                'kucoin/ticker': [ "BUSD", "USDT" ], // kucoin.com
                'indoex/ticker': [ "BUSD", "USDT" ], // indoex.io
            },
        },
        WitnetRequestPriceDaiUsd6: {
            ...priceTicker,
            retrievals: {
                'binance.us/ticker': [ "DAI", "USD" ], // binance.us
                'bitstamp/ticker': [ "dai", "usd" ], // bitstamp.net
                'bittrex/ticker': [ "DAI", "USD" ], // bittrex.com
                'kraken/ticker': [ "DAI", "USD" ], // kraken.com
                'gateio/ticker': [ "dai", "usd" ], // gateio.io
            },
        },
        WitnetRequestPriceElaUsdt6: {
            ...priceTicker,
            retrievals: {
                'gateio/ticker': [ "ela", "usdt" ], // gate.io
                'huobi/ticker': [ "ela", "usdt" ], // huobi.pro
                'kucoin/ticker': [ "ELA", "USDT" ], // kucoin.com   
            },
        },
        WitnetRequestPriceEthUsd6: {
            ...priceTicker,
            retrievals: {
                'binance.us/ticker': [ "ETH", "USD" ], // binance.us
                'bitfinex/ticker': [ "eth", "usd" ], // bitfinex.com
                'bitstamp/ticker': [ "eth", "usd" ], // bitstamp.net
                'bittrex/ticker': [ "ETH", "USD" ], // bittrex.com
                'coinbase/ticker': [ "ETH", "USD" ], // coinbase.com
                'kraken/ticker': [ "ETH", "USD" ], // kraken.com
            },
        },
        WitnetRequestPriceFuseUsdt6: {
            ...priceTicker,
            retrievals: {
                'ascendex/ticker': [ "FUSE", "USDT" ], // ascendex.com
                'gateio/ticker': [ "fuse", "usdt" ], // gateio.io
                'huobi/ticker': [ "fuse", "usdt" ], // huobi.pro
                'mexc/ticker': [ "FUSE", "USDT" ], // mexc.com
            }
        },
        WitnetRequestPriceGlintUsdc6: {
            args: [{
                pair_id: "0x61b4cec9925b1397b64dece8f898047eed0f7a07", 
                token_id: "0",
            }],
            template: "WitnetRequestTemplateBeamswap",
        },
        WitnetRequestPriceHtUsdt6: {
            ...priceTicker,
            retrievals: {
                'ascendex/ticker': [ "HT", "USDT" ], // ascendex.com
                'gateio/ticker': [ "ht", "usdt" ], // gateio.io
                'huobi/ticker': [ "ht", "usdt" ], // huobi.pro
                'mexc/ticker': [ "HT", "USDT" ], // mexc.com
            },
        },
        WitnetRequestPriceMaticUsd6: {
            ...priceTicker,
            retrievals: {
                'binance.us/ticker': [ "MATIC", "USD" ], // binance.us
                'bitstamp/ticker': [ "matic", "usd" ], // bitstamp.net
                'coinbase/ticker': [ "MATIC", "USD" ], // coinbase.com
                'kraken/ticker': [ "MATIC", "USD" ], // kraken.com
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
        WitnetRequestPriceUsdcUsd6: {
            ...priceTicker,
            retrievals: {
                'bitstamp/ticker': [ "usdc", "usd" ], // bitstamp.net
                'bittrex/ticker': [ "USDC", "USD" ], // bittrex.com
                'gemini/ticker': [ "usdc", "usd" ], // gemini.com
                'kraken/ticker': [ "USDC", "USD" ], // kraken.com
            },
        },
        WitnetRequestPriceUsdtUsd6: {
            ...priceTicker,
            retrievals: {
                'binance.us/ticker': [ "USDT", "USD" ], // binance.us
                'bitstamp/ticker': [ "usdt", "usd" ], // bitstamp.net
                'bittrex/ticker': [ "USDT", "USD" ], // bittrex.com
                'kraken/ticker': [ "USDT", "USD" ], // kraken.com
            },
        },
        WitnetRequestPriceVsqDai6: {
            args: [{
                pair_id: "0x5cf66ceaf7f6395642cd11b5929499229edef531", 
                token_id: "1",
            }],
            template: "WitnetRequestTemplateMaticExchange",
        },
    },
    /// path: { ... path: {
    /////// FORMULA 1 ////////////////////////////////////////////////////////////////////////        
    ///     WitnetRequestXXX: {
    ///         args: [ [ .. ], ... ], 
    ///         template: WitnetRequestTemplateYYY // within migrations/witnet/templates
    ///     },
    ///     // ...
    /////// FORMULA 2 ////////////////////////////////////////////////////////////////////////        
    ///     WitnetRequestZZZ: {
    ///         retrievals: [
    ///             'unique-resource-name'          // => within assets/witnet/radons.retrievals
    ///             ...,
    ///         ],
    ///         aggregator: 'unique-resource-name'  // => within assets/witnet/radons.reducers
    ///         tally: 'unique-resource-name'       // => within assets/witnet/radons.reducers
    ///      }
    ///     // ...
    /// },
}
