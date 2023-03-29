// SPDX-License-Identifier: UNLICENSED

import "./../../templates/HandshakeSuperClass_Structs.sol";

pragma solidity ^0.8.17;

    struct WithdrawalsConfig {
        uint _minApprovalsToWithdraw;
        uint _maxWithdrawalValue;
    }

    struct WithdrawalProposal {

        uint _id;
        uint _value;
        string _objective;
        address payable _to;
        Member _proposer;
        Member[] _authorizations;
        bool _authorized;
        WithdrawalExecutionInfo _executionInfo;
    }

    struct WithdrawalExecutionInfo {
        bool _executed;
        uint _executionTimestamp;
        uint _withdrawalId;
    }

