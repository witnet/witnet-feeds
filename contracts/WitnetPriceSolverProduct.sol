// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "witnet-solidity-bridge/contracts/interfaces/IWitPriceFeeds.sol";
import "witnet-solidity-bridge/contracts/mockups/WitPriceFeedsSolverBase.sol";

contract WitPriceSolverProduct 
    is
        WitPriceFeedsSolverBase
{
    using Witnet for Witnet.ResultTimestamp;
    
    constructor () {}

    function class() virtual override external pure returns (string memory) {
        return type(WitPriceSolverProduct).name;
    }

    function solve(bytes4 feedId)
        virtual override
        external view
        onlyDelegator
        returns (Price memory _latestPrice)
    {
        bytes4[] memory _deps = WitPriceFeedsDataLib.depsOf(feedId);
        for (uint _ix = 0; _ix < _deps.length; _ix ++) {
            Price memory _price = IWitPriceFeeds(address(this)).latestPrice(_deps[_ix]);    
            if (_price.timestamp.gt(_latestPrice.timestamp)) {
                // timestamp and drTxHash of the routed price feed will be that
                // of the most recentely updated dependency
                _latestPrice.timestamp = _price.timestamp;
                _latestPrice.drTxHash = _price.drTxHash;
            }
            if (
                _price.latestStatus != IWitPriceFeedsSolver.LatestUpdateStatus.Ready
                    && _latestPrice.latestStatus == IWitPriceFeedsSolver.LatestUpdateStatus.Ready
            ) {
                // a routed price feed will be set as awaiting if at least one dependency is 
                // in awaiting status
                _latestPrice.latestStatus = IWitPriceFeedsSolver.LatestUpdateStatus.Awaiting;
            }

            if (_ix == 0) {
                _latestPrice.value = _price.value;
                _latestPrice.latestStatus = _price.latestStatus;
            
            } else {
                _latestPrice.value *= _price.value;
            }
        }
        int _reductor = WitPriceFeedsDataLib.seekRecord(feedId).solverReductor;
        if (_reductor < 0) {
            _latestPrice.value /= uint64(10 ** uint(-_reductor));
        
        } else if (_reductor > 0) {
            _latestPrice.value *= uint64(10 ** uint(_reductor));
        }
    }
}