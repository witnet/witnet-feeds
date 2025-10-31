const { Witnet } = require("@witnet/sdk")
const {
    RadonRequestFromAssets,
    RadonTemplate, 
    reducers,
} = Witnet.Radon

function PriceTickerRequest(argsMap) {
    return RadonRequestFromAssets({
        assets: require("./sources/index.cjs"), 
        argsMap, 
        sourcesReducer: reducers.PriceAggregate(),
        witnessReducer: reducers.PriceTally()
    });
};

function PriceTickerTemplate(specs) {
    return new RadonTemplate(
        {
            sources: specs?.sources,
            sourcesReducer: reducers.PriceAggregate(),
            witnessReducer: reducers.PriceTally()
        }, 
        specs?.samples,
    );
};

module.exports = {
    PriceTickerRequest,
    PriceTickerTemplate,
};
