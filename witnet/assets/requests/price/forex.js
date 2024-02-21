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
            "revolut.com/ticker": ["HKD", "USD", "US"],
            "mastercard.us/ticker": ["HKD", "USD"],
        }
    ),

};

