module.exports = {
    DeFi: {
        "price-feeds": {
            ...require("./price/crypto.js"),
            ...require("./price/forex.js"),
        }
    },
};
