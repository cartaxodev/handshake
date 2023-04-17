// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

struct DeadlineControlConfig {
    bool _isControlActive;
    uint _dailyFee;
    uint _weeklyFee;
    uint _monthlyFee;
}

struct DepositScheduling {
    uint _memberId;
    uint _value;
    uint _deadlineTimestamp;
    DepositExecutionInfo _executionInfo;
}

struct DepositExecutionInfo {
    bool _executed;
    uint _principalValue;
    uint _lateDepositFee;
    uint _finalValue;
    uint _depositId;
    uint _executionTimestamp;
}