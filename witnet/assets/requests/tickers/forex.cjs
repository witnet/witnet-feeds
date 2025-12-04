const { PriceTickerRequest } = require("../../utils.cjs");

module.exports = {
	WitOracleRequestPriceHkdUsd6: PriceTickerRequest({
		"ticker/coinbase.com": ["HKD", "USD"],
		"ticker/revolut.com": ["HKD", "USD", "US"],
	}),

	WitOracleRequestPriceKrwUsd9: PriceTickerRequest({
		"ticker#9/revolut.com": ["KRW", "USD", "KR"],
	}),
};
