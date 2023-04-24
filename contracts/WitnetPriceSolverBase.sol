// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "witnet-solidity-bridge/contracts/data/WitnetFeedsData.sol";
import "witnet-solidity-bridge/contracts/interfaces/V2/IWitnetPriceFeeds.sol";
import "witnet-solidity-bridge/contracts/interfaces/V2/IWitnetPriceSolver.sol";

abstract contract WitnetPriceSolverBase
    is
        IWitnetPriceSolver,
        WitnetFeedsData
{
    uint8 public immutable override decimals;

    uint256 internal immutable __depsCount;
    bytes32 internal immutable __depsFlag;

    constructor(
            uint8 _decimals,
            bytes4[] memory _deps
    ) {
        decimals = _decimals;
        assert(_deps.length > 0 && _deps.length <= 8);
        bytes32 _depsFlag;
        for (uint _ix = 0; _ix < _deps.length; _ix ++) {
            assert(_deps[_ix] != 0);
            _depsFlag |= (bytes32(_deps[_ix]) >> (32 * _ix));
        }
        __depsCount = _deps.length;
        __depsFlag = _depsFlag;
    }

    function class() external pure returns (bytes4) {
        return type(IWitnetPriceSolver).interfaceId;
    }

    function deps() override public view returns (bytes4[] memory _deps) {
        _deps = new bytes4[](__depsCount);
        bytes32 _depsFlag = __depsFlag;
        for (uint _ix = 0; _ix < _deps.length; _ix ++) {
            _deps[_ix] = bytes4(_depsFlag);
            _depsFlag <<= 32;
        }
    }

    function validate(bytes4 feedId) virtual override external {
        uint _innerDecimals;
        bytes4[] memory _deps = deps();
        for (uint _ix = 0; _ix < _deps.length; _ix ++) {
            Record storage __record = __records_(_deps[_ix]);
            require(__record.index > 0, "WitnetPriceSolverBase: missing dependency");
            require(
                _deps[_ix] != feedId, 
                string(abi.encodePacked(
                    "WitnetPriceSolverBase: first-level loop: 0x",
                    Witnet.toHexString(uint8(bytes1(feedId))),
                    Witnet.toHexString(uint8(bytes1(feedId << 8))),
                    Witnet.toHexString(uint8(bytes1(feedId << 16))),
                    Witnet.toHexString(uint8(bytes1(feedId << 24)))
                ))
            );
            _innerDecimals += __record.decimals;
        }
        __records_(feedId).reductor = int(uint(decimals)) - int(_innerDecimals);
    }
}