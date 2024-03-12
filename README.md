# witnet-feeds

Repository of the data feeds sustained by the Witnet Foundation as public goods on multiple EVM chains, and leveraged on the Witnet Oracle blockchain. 

A whole list of built-up price feeds and actual public data providers for each one of them can be found in the `witnet/assets/requests` folder.

The implementation of this repository is leveraged on the [witnet-solidity](https://npmjs.com/witnet-solidity) NPM package distributed by the Witnet Foundation. 

## Package maintenance scripts

Two main concepts to understand first: 

- Feeds denomination in this repository follow the ERC-2362 proposal so every data feed is uniquely named by its base, quote and the base-10 exponent by which actual price values get multiplied before being reported to the EVM context. For instance, "eth/usd-6" would stand for the ETH/USD price feed, whose value would match the integer part of multiplying the actual decimal quotation of ETH in US dollars (e.g. $3,867.521143) by 1,000,000 (e.g 3867521143).

- Routed feeds are those that involve no specific data requests resolved by the Witnet blockchain, but rather get resolved by combining the last updated onchain values of other feeds, or even other routed feeds. Despite the difference, denomination of routed feeds follows the same rules as abovementioned.

> Routed feeds are declared within the `witnet/routes` folder.

### Check price feeds current status

`$ yarn pfs:status <ecosystem:network> [...captions]`

If no feed captions are specified, status of all feeds supported on specified chain will be listed.

> To get a list of supported ecosystems and networks, please use `npx witnet avail --chains`.

### Force the update of price feeds

`$ yarn pfs:status <ecosystem:network> --update [--from <STRING>] [...captions]`

### Deploy a new price feed

`$ yarn pfs:deploy <ecosystem:network> ...captions`

Captions must have a matching request artifact name declared within `witnet/assets/requests`, or a matching entry within the `witnet/routes/price/index.js` file. 

> Corresponding Witnet data request artifact names follow the pattern `WitnetRequestPrice<Base><Quote><Exponent>` (e.g. "eth/usd-6" => "WitnetRequestPriceEthUsd6").

## Contribute

Feel free to create Pull Requests in Github, if willing to ask the Witnet Foundation to support either new price feeds or improving the existing ones with additional public data sources. 

## Leverage

If you are willing to interact with the price feeds on any of the EVM chains currently bridged to the Witnet Oracle blockcahin, please follow the instruction on how to import and start using the [witnet-solidity] NPM package within your project. 

Instead, if you are willing to build (and sustain) your own set of price feeds, while leveraging the data sources and Witnet Data Requests already declared within this package, please follow these steps:

- Install the package: 
  `$ npm install --save-dev witnet-feeds`

- Initialize the bundled `witnet-solidity` package: 
  `$ npx witnet init`

- Use the bundled Solidity Wizard tool:
  `npx witnet wizard`

Either if you opt to import the [witnet-solidty] or the [witnet-feeds] package, the Witnet Solidity Wizard will help you to create Solidity mockup contracts showing how to interact with the global `WitnetPriceFeeds` contract as to:
- List currently supported price feeds.
- Introspect actual data sources being used for each price feed.
- Read the last price updates, and metadata, including the timestamp and the hash of the transaction in the Witnet blockchain that actually solved every price update.
- Force price updates from your smart contracts.

[witnet-feeds] https://npmjs.com/witnet-feeds
[witnet-solidity] https://npmjs.com/witnet-solidity