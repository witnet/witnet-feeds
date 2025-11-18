const { PriceTickerRequest } = require("../../utils.cjs");

module.exports = {
	WitOracleRequestPriceForexHkdUsd6: PriceTickerRequest({
		"ticker/coinbase.com": ["HKD", "USD"],
		"ticker/revolut.com": ["HKD", "USD", "US"],
	}),

	WitOracleRequestPriceForexKrwUsd9: PriceTickerRequest({
		"ticker#9/revolut.com": ["KRW", "USD", "KR"],
	}),
};
