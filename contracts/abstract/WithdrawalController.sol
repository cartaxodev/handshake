// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "./BankAccount.sol";

abstract contract WithdrawalController is BankAccount {

    uint internal _minApprovalsToWithdraw;
    uint internal _withdrawalsIncremental;
    uint internal _maxWithdrawalValue;
    WithdrawalProposal[] internal _proposedWithdrawals;
    WithdrawalProposal[] internal _executedWithdrawals;

    constructor (Member[] memory membersList_,
                address[] memory memberManagers_,
                address[] memory withdrawalApprovers_,
                uint minApprovalsToWithdraw_,
                uint maxWithdrawValue_) BankAccount (membersList_, memberManagers_) {

                    _minApprovalsToWithdraw = minApprovalsToWithdraw_;
                    _maxWithdrawalValue = maxWithdrawValue_;
                    _withdrawalsIncremental = 0;

                    for (uint i = 0; i < withdrawalApprovers_.length; i++) {
                        _grantRole(WITHDRAWAL_APPROVER_ROLE, withdrawalApprovers_[i]);
                    }
                }

    
    //** STRUCTS **//

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


    //** PUBLIC GETTERS **//

    function getProposedWithdrawals () public view returns (WithdrawalProposal[] memory) {
        return _proposedWithdrawals;
    }

    function getExecutedWithdrawals () public view returns (WithdrawalProposal[] memory) {
        return _executedWithdrawals;
    }
 

    //** PUBLIC API **//

    function proposeWithdrawal (uint8 proposerIndex_, uint value_, string memory objective_, address payable to_) public onlyRole(WITHDRAWAL_APPROVER_ROLE) onlyMainAddress(proposerIndex_) {

        require(value_ <= _getContractBalance(), 
            'Withdrawal value must be equal or less than the contract balance');

        require(value_ <= _maxWithdrawalValue, 
            'Withdrawal value must be equal or less than the maximum defined in this contract');

        require(bytes(objective_).length >= 20, "The objective must have at least 20 characters");

        WithdrawalProposal storage newWithdrawalProposal = _proposedWithdrawals.push();

        newWithdrawalProposal._id = _withdrawalsIncremental++;
        newWithdrawalProposal._value = value_;
        newWithdrawalProposal._objective = objective_;
        newWithdrawalProposal._to = to_;
        newWithdrawalProposal._proposer = _activeMembers[proposerIndex_];
        newWithdrawalProposal._authorized = false;
        newWithdrawalProposal._authorizations.push(_activeMembers[proposerIndex_]);

        if (_minApprovalsToWithdraw <= 1) {
            newWithdrawalProposal._authorized = true;
            executeWithdrawal(proposerIndex_, newWithdrawalProposal._id);
            return;
        }
    }


    function authorizeWithdrawal (uint8 authorizerIndex_, uint withdrawId_) public onlyRole(WITHDRAWAL_APPROVER_ROLE) onlyMainAddress(authorizerIndex_) {

        for (uint i = 0; i < _proposedWithdrawals.length; i++) {
            if (_proposedWithdrawals[i]._id == withdrawId_) {
                
                WithdrawalProposal storage withdrawalProposal = _proposedWithdrawals[i];
                Member storage authorizer = _activeMembers[authorizerIndex_];

                for (uint j = 0; j < withdrawalProposal._authorizations.length; j++) {
                    require (withdrawalProposal._authorizations[j]._id != authorizer._id, "A member cannot authorize a withdrawal twice");
                }

                withdrawalProposal._authorizations.push(authorizer);

                if (withdrawalProposal._authorizations.length >= _minApprovalsToWithdraw) {
                    withdrawalProposal._authorized = true;
                }
                break;
            }
        }
    }


    function executeWithdrawal (uint8 memberIndex_, uint withdrawalProposalId_) public onlyRole(WITHDRAWAL_APPROVER_ROLE) onlyMainAddress(memberIndex_) {

        uint i;
        bool executed = false;

        for (i = 0; i < _proposedWithdrawals.length; i++) {

            WithdrawalProposal storage w = _proposedWithdrawals[i];

            if (w._id == withdrawalProposalId_) {

                require(w._authorized && !w._executionInfo._executed, "A withdrawal must be authorized and not executed yet, to be executed");
                require(w._value <= _getContractBalance(), "There is not enough balance in this contract to execute this transaction");
                
                w._executionInfo._executed = true;
                w._executionInfo._executionTimestamp = block.timestamp;

                _executedWithdrawals.push(w);

                _withdraw(w._to, w._value);
                w._executionInfo._withdrawalId = _registerWithdrawals(w._to, w._value, w._executionInfo._executionTimestamp);
                
                executed = true;
                break;
            }
        }

        require (executed, "Proposed withdrawal not found");

        //Deleting executed withdraw from proposed withdrawals list
        if (i == (_proposedWithdrawals.length - 1)) {
            _proposedWithdrawals.pop();

        } else {
            WithdrawalProposal storage execWithdrawal = _proposedWithdrawals[i];
            _proposedWithdrawals[i] = _proposedWithdrawals[_proposedWithdrawals.length - 1];
            _proposedWithdrawals[_proposedWithdrawals.length - 1] = execWithdrawal;
            _proposedWithdrawals.pop();
        }
    }


}