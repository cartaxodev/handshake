// SPDX-License-Identifier: UNLICENSED

import "./../../patterns/FeatureProxy.sol";
import "./WithdrawalController_Logic.sol";

pragma solidity ^0.8.17;

contract WithdrawalController_Proxy is FeatureProxy {

    constructor (WithdrawalController_Logic logic_,
                 bytes memory data_) FeatureProxy(address(logic_), data_) {
    }
}