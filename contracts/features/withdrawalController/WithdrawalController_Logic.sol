// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "./../../patterns/FeatureLogic.sol";
import "./../../templates/HandshakeSuperClass_Structs.sol";
import "./WithdrawalController_Structs.sol";

contract WithdrawalController_Logic is FeatureLogic {

    WithdrawalsConfig private _withdrawalsConfig;
    uint internal _withdrawalsIncremental;
    WithdrawalProposal[] internal _proposedWithdrawals;
    WithdrawalProposal[] internal _executedWithdrawals;

/* CONTRACT INITIALIZATION FUNCTON 
        IT MUST BE CALLED BY THE PROXY CONTRACT CONSTRUCTOR */
    function initializeFeature (address concreteContractAddress_,
                                Member[] memory membersList_,
                                address[] memory withdrawalApprovers_,
                                uint minApprovalsToWithdraw_,
                                uint maxWithdrawValue_
                                    ) external initializer {
      
        _initializeLogic(concreteContractAddress_);
        require (minApprovalsToWithdraw_ <= membersList_.length, "The minimum number of members approvals necessary to withdraw cannot be greater than the number of active members");
        require (minApprovalsToWithdraw_ <= withdrawalApprovers_.length, "The minimum number of members approvals necessary to withdraw cannot be greater than the total of approvers of this contract");
        require (maxWithdrawValue_ > 0, "The maximum value of a withdrawal must be greater than zero");

        _withdrawalsConfig._minApprovalsToWithdraw = minApprovalsToWithdraw_;
        _withdrawalsConfig._maxWithdrawalValue = maxWithdrawValue_;
        _withdrawalsIncremental = 0;

        _checkApproversAsMembers(withdrawalApprovers_, membersList_);
    }

    //** PUBLIC GETTERS **//

    function getProposedWithdrawals () public view returns (WithdrawalProposal[] memory) {
        return _proposedWithdrawals;
    }

    function getExecutedWithdrawals () public view returns (WithdrawalProposal[] memory) {
        return _executedWithdrawals;
    }


    //** INTERNAL METHODS **//

    function _checkApproversAsMembers (address[] memory withdrawalApprovers_, Member[] memory membersList_) private pure {
        
        for (uint i = 0; i < withdrawalApprovers_.length; i++) {
            bool approverIsMember = false;
            for (uint j = 0; j < membersList_.length; j++) {
                if (withdrawalApprovers_[i] == membersList_[j]._mainAddress) {
                    approverIsMember = true;
                    //_concreteContract.__grantRole(WITHDRAWAL_APPROVER_ROLE, withdrawalApprovers_[i]);
                    //break;
                }
            }
            require (approverIsMember, "One (or more) withdrawal approver is not an active member");
        }
    }

    function _getMinApprovalsToWithdrawal () private view returns (uint) {

        uint approversCount = _concreteContract.getRoleMemberCount(WITHDRAWAL_APPROVER_ROLE);

        if (approversCount >= _withdrawalsConfig._minApprovalsToWithdraw) {
            return _withdrawalsConfig._minApprovalsToWithdraw;

        } else {
            return approversCount;
        }
    }

    function _getMaxWithdrawalValue () private view returns (uint) {
        return _withdrawalsConfig._maxWithdrawalValue;
    }
 

    //** PUBLIC API **//

    function proposeWithdrawal (uint8 proposerId_, uint value_, string memory objective_, address payable to_) public onlyApproved onlyRole(WITHDRAWAL_APPROVER_ROLE) onlyMainAddress(proposerId_) {

        require(value_ <= _concreteContract.getContractBalance(), 
            'Withdrawal value must be equal or less than the contract balance');

        require(value_ <= _getMaxWithdrawalValue(), 
            'Withdrawal value must be equal or less than the maximum defined in this contract');

        require(bytes(objective_).length >= 20, "The objective must have at least 20 characters");

        WithdrawalProposal storage newWithdrawalProposal = _proposedWithdrawals.push();

        newWithdrawalProposal._id = _withdrawalsIncremental++;
        newWithdrawalProposal._value = value_;
        newWithdrawalProposal._objective = objective_;
        newWithdrawalProposal._to = to_;
        newWithdrawalProposal._proposer = _concreteContract.getMemberById(proposerId_);
        newWithdrawalProposal._authorized = false;
        newWithdrawalProposal._authorizations.push(_concreteContract.getMemberById(proposerId_));

        if (_getMinApprovalsToWithdrawal() <= 1) {
            newWithdrawalProposal._authorized = true;
            executeWithdrawal(proposerId_, newWithdrawalProposal._id);
            return;
        }
    }


    function authorizeWithdrawal (uint8 authorizerId_, uint withdrawalId_) public onlyApproved onlyRole(WITHDRAWAL_APPROVER_ROLE) onlyMainAddress(authorizerId_) {

        for (uint i = 0; i < _proposedWithdrawals.length; i++) {
            if (_proposedWithdrawals[i]._id == withdrawalId_) {
                
                WithdrawalProposal storage withdrawalProposal = _proposedWithdrawals[i];
                Member memory authorizer = _concreteContract.getMemberById(authorizerId_);

                for (uint j = 0; j < withdrawalProposal._authorizations.length; j++) {
                    require (withdrawalProposal._authorizations[j]._id != authorizer._id, "A member cannot authorize a withdrawal twice");
                }

                withdrawalProposal._authorizations.push(authorizer);

                if (withdrawalProposal._authorizations.length >= _getMinApprovalsToWithdrawal()) {
                    withdrawalProposal._authorized = true;
                }
                break;
            }
        }
    }


    function executeWithdrawal (uint8 memberId_, uint withdrawalProposalId_) public onlyApproved onlyRole(WITHDRAWAL_APPROVER_ROLE) onlyMainAddress(memberId_) {

        uint i;
        bool executed = false;

        for (i = 0; i < _proposedWithdrawals.length; i++) {

            WithdrawalProposal storage w = _proposedWithdrawals[i];

            if (w._id == withdrawalProposalId_) {

                require(w._authorized && !w._executionInfo._executed, "A withdrawal must be authorized and not executed yet, to be executed");
                require(w._value <= _concreteContract.getContractBalance(), "There is not enough balance in this contract to execute this transaction");
                
                w._executionInfo._executed = true;
                w._executionInfo._executionTimestamp = block.timestamp;

                _executedWithdrawals.push(w);

                w._executionInfo._withdrawalId = _concreteContract.__withdraw(w._to, w._value);
                
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