// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "witnet-solidity-bridge/contracts/apps/WitnetPriceSolverBase.sol";

contract WitnetPriceSolverProduct 
    is
        WitnetPriceSolverBase
{
    constructor () {}

    function class() virtual override external pure returns (string memory) {
        return type(WitnetPriceSolverProduct).name;
    }

    function solve(bytes4 feedId)
        virtual override
        external view
        onlyDelegator
        returns (Price memory _latestPrice)
    {
        bytes4[] memory _deps = _depsOf(feedId);
        for (uint _ix = 0; _ix < _deps.length; _ix ++) {
            Price memory _price = IWitnetPriceFeeds(address(this)).latestPrice(_deps[_ix]);
            if (_price.timestamp > _latestPrice.timestamp) {
                // timestamp and tallyhash of the routed price feed will be that
                // of the most recentely updated dependency
                _latestPrice.timestamp = _price.timestamp;
                _latestPrice.tallyHash = _price.tallyHash;
            }
            if (
                _price.status != WitnetV2.ResponseStatus.Ready
                    && _latestPrice.status == WitnetV2.ResponseStatus.Ready
            ) {
                // a routed price fee will be set as awaiting if at least one dependency is 
                // in awaiting status
                _latestPrice.status = WitnetV2.ResponseStatus.Awaiting;
            }
            if (_ix == 0) {
                _latestPrice.value = _price.value;
            } else {
                _latestPrice.value *= _price.value;
            }
        }
        int _reductor = __records_(feedId).solverReductor;
        if (_reductor < 0) {
            _latestPrice.value /= (10 ** uint(-_reductor));
        } else if (_reductor > 0) {
            _latestPrice.value *= (10 ** uint(_reductor));
        }
    }
}