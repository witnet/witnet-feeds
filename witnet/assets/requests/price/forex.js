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

    WitnetRequestPriceHkdUsd6: Witnet.PriceTickerRequest(
        sources, {
            "coinbase.com/ticker": ["HKD", "USD"],
            "mastercard.us/ticker": ["HKD", "USD"],
            "revolut.com/ticker": ["HKD", "USD", "US"],
        }
    ),

    WitnetRequestPriceKrwUsd9: Witnet.PriceTickerRequest(
        sources, { 
            "fastforex.io/ticker#9": ["KRW", "USD"], 
            "revolut.com/ticker#9": ["KRW", "USD", "KR"],
            "mastercard.us/ticker#9": ["KRW", "USD"],
        }
    ),

};

