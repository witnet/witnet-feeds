// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./WitnetPriceSolverBase.sol";

contract WitnetPriceSolverProduct 
    is
        WitnetPriceSolverBase
{
    constructor() {}

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
                _latestPrice.timestamp = _price.timestamp;
                _latestPrice.drTxHash = _price.drTxHash;
            }
            if (
                _price.status == Witnet.ResultStatus.Awaiting
                    && _latestPrice.status == Witnet.ResultStatus.Ready
            ) {
                _latestPrice.status = Witnet.ResultStatus.Awaiting;
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