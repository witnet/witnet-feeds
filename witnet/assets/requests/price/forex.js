const { utils, Witnet } = require("witnet-solidity")
const { legacy } = require("witnet-solidity/assets")

const retrievals = Witnet.RadonDictionary(Witnet.RadonRetrieval, require("../../retrievals"));
const { PriceTickerRequest } = require("../../utils")

module.exports = {

    WitOracleRequestPriceHkdUsd6: PriceTickerRequest(
        retrievals, {
            "ticker/coinbase.com": ["HKD", "USD"],
            "ticker/mastercard.us": ["HKD", "USD"],
            "ticker/revolut.com": ["HKD", "USD", "US"],
        }
    ),

    WitOracleRequestPriceKrwUsd9: PriceTickerRequest(
        retrievals, { 
            "ticker/fastforex.io#9": ["KRW", "USD"], 
            "ticker/revolut.com#9": ["KRW", "USD", "KR"],
            "ticker/mastercard.us#9": ["KRW", "USD"],
        }
    ),

};

