// SPDX-License-Identifier: UNLICENSED

import "./../../patterns/FeatureProxy.sol";
import "./DepositScheduler_Logic.sol";
//import "hardhat/console.sol";

pragma solidity ^0.8.17;

contract DepositScheduler_Proxy is FeatureProxy {

    constructor (DepositScheduler_Logic logic_, 
                 bytes memory data_) FeatureProxy(address(logic_), data_) {
    }

}