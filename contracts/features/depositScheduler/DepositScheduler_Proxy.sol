// SPDX-License-Identifier: UNLICENSED

import "./../../patterns/FeatureProxy.sol";
import "./DepositScheduler_Logic.sol";

pragma solidity ^0.8.17;

contract DepositSchedule_Proxy is FeatureProxy {

    constructor (DepositScheduler_Logic logic_, 
                 bytes memory data_,
                 HandshakeSuperClass concreteContract_,
                 DeadlineControlConfig memory deadlineControlConfig_,
                 DepositScheduling[] memory depositSchedule_) FeatureProxy(address(logic_), data_) {

        logic_.initializeFeature(concreteContract_, deadlineControlConfig_, depositSchedule_); 
    }
}