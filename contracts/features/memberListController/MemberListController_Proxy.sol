// SPDX-License-Identifier: UNLICENSED

import "./../../patterns/FeatureProxy.sol";
import "./MemberListController_Logic.sol";

pragma solidity ^0.8.17;

contract MemberListController_Proxy is FeatureProxy {

    constructor (MemberListController_Logic logic_,
                 bytes memory data_) FeatureProxy(address(logic_), data_) {
    }
}