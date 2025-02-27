const { Witnet } = require("witnet-solidity")

function PriceTickerRequest(dictionary, argsMap) {
    return Witnet.RadonRequestFromDictionary({
        retrieve: {
            argsMap,
            dictionary: dictionary,
        },
        aggregate: Witnet.RadonReducers.PriceAggregate(),
        tally: Witnet.RadonReducers.PriceTally()
    })
};

function PriceTickerTemplate(specs) {
    return new Witnet.RadonTemplate(
        {
            retrieve: specs?.retrieve,
            aggregate: Witnet.RadonReducers.PriceAggregate(),
            tally: Witnet.RadonReducers.PriceTally()
        }, 
        specs?.samples
    );
};

module.exports = {
    PriceTickerRequest,
    PriceTickerTemplate,
};
