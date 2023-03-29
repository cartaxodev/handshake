// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "./../util/AccessControlUtils.sol";
import "./HandshakeSuperClass_Structs.sol";

abstract contract HandshakeSuperClass is  AccessControlEnumerable, AccessControlUtils {
    
    //Objective of this contract
    string private _objective;

    //Members lists
    Member[] internal _activeMembers;
    Member[] private _inactiveMembers;
    uint private _memberIdIncremental;

    //Changes on members lists
    MemberProposal[] private _memberInclusionProposals;
    uint private _memberInclusionProposalsIncremental;
    uint private _minApprovalsToAddNewMember;

    //Contract Approvals
    mapping(uint => bool) private _contractApprovals;  // Member._id => approvalBoolean
    bool private _contractApproved;

    //Deposits
    Deposit[] private _depositsList;
    uint private _depositsIncremental;
    
    //Withdrawals
    Withdrawal[] private _withdrawalsList;
    uint private _withdrawalsIncremental;


    constructor(string memory objective_,
                 Member[] memory membersList_, 
                 address[] memory memberManagers_) {

        _objective = objective_;

        for (uint i = 0; i < membersList_.length; i++) {
            _addNewMember(membersList_[i]);
        }

        for (uint i = 0; i < memberManagers_.length; i++) {
            _grantRole(MEMBER_MANAGER_ROLE, memberManagers_[i]);
        }
    }

    /* CUSTOM MODIFIERS */

    modifier onlyInternalFeature() {
        require(hasRole(INTERNAL_FEATURE_ROLE, msg.sender), 
            'Only internal features can call this function');
        _;
    }
    
    modifier onlyMainAddress (uint memberIndex_) {
        require(_activeMembers[memberIndex_]._mainAddress == msg.sender, 
            'Only the main address of an active member can call this function');
        _;
    }

    modifier onlySecondaryAddress (uint memberIndex_) {
        require (_checkSecondaryAddress(memberIndex_, msg.sender), 
            'Only an allowed secondary address of an active member can call this function');
        _;
    }

    modifier anyMemberAddress (uint memberIndex_) {
        require(
            _activeMembers[memberIndex_]._mainAddress == msg.sender
            || _checkSecondaryAddress(memberIndex_, msg.sender),
                'Only the main address or an allowed secondary address of an active member can call this function'
        );
        _;
    }

    modifier contractApprovedForAll {
        require(_contractApproved, "This contract is not aproved by all active members");
        _;
    }


    /* PUBLIC VIEW GETTERS */

    function getActiveMembers () public view returns (Member[] memory) {
        return _activeMembers;
    }


    function isContractApproved () public view returns (bool) {
        return _contractApproved;
    }

    function getMemberApproval (uint memberIndex_) public view returns (bool) {
        return _contractApprovals[_activeMembers[memberIndex_]._id];
    }

    function getMemberIndex (address memberMainAddress_) public view returns (uint8) {
        uint8 i = 0;
        bool found = false;

        for (i = 0; i < _activeMembers.length; i++) {
            if (_activeMembers[i]._mainAddress == memberMainAddress_) {
                found = true;
                break;
            }
        }

        require(found == true, 'This address is not a main address of an active member');

        return i;
    }

     function getWithdrawals () public view returns (Withdrawal[] memory) {
        return _withdrawalsList;
    }

    function getDeposits () public view returns (Deposit[] memory) {
        return _depositsList;
    }


    /* PRIVATE FUNCTIONS */

    function _addNewMember (Member memory newMember_) private {
        Member storage m = _activeMembers.push();
        
        m._id = _memberIdIncremental++;
        m._login = newMember_._login;
        m._mainAddress = newMember_._mainAddress;
        m._secondaryAddresses = newMember_._secondaryAddresses;

        _contractApproved = false; // Each new active member needs to approve the contract
    }

    function _updateContractApproval () private returns (bool) {

        bool approved = true;
        for (uint i = 0; i < _activeMembers.length; i++) {
            if (_contractApprovals[_activeMembers[i]._id] == false) {
                approved = false;
                break;
            }
        }
        _contractApproved = approved;
        return approved;
    }

    function _grantFeatureRole (address featureAddress_) internal {

        _grantRole(INTERNAL_FEATURE_ROLE, featureAddress_);
    }

    /* INTERNAL FEATURES ACCESSIBLE FUNCTIONS */

    function _checkSecondaryAddress (uint memberIndex_, address secondaryAddress_) public view onlyInternalFeature returns (bool) {
        bool allowed = false;
        Member storage m = _activeMembers[memberIndex_];

        for (uint i = 0; i < m._secondaryAddresses.length; i++) {
            if (m._secondaryAddresses[i] == secondaryAddress_) {
                allowed = true;
                break;
            }
        }

        return allowed;
    }

    function _registerDeposit (address from_, uint value_, uint depositTimestamp_) public onlyInternalFeature returns (uint) {
        
        Deposit memory deposit = Deposit({
            _id: _depositsIncremental++,
            _from: from_,
            _value: value_,
            _depositTimestamp: depositTimestamp_
        });

        _depositsList.push(deposit);

        return deposit._id;
    }

    function _registerWithdrawals (address to_, uint value_, uint withdrawalTimestamp_) public onlyInternalFeature returns (uint) {
        
        Withdrawal memory withdrawal = Withdrawal({
            _id: _withdrawalsIncremental++,
            _to: to_,
            _value: value_,
            _withdrawalTimestamp: withdrawalTimestamp_
        });

        _withdrawalsList.push(withdrawal);

        return withdrawal._id;
    }

    function _getTokenType () virtual public view returns (AllowedTokens);
    
    function _getContractBalance () virtual public view returns (uint);

    function _deposit (uint depositValue_) virtual public payable;

    function _withdraw (address payable destination_, uint value_) virtual public;


    //** PUBLIC API */

    function approveTheContract (uint memberIndex_) public onlyMainAddress (memberIndex_) {
        require (_contractApprovals[memberIndex_] == false, "A member only can approve a contract once.");
        _contractApprovals[memberIndex_] = true;
        _updateContractApproval();
    }

    function addSecondaryAddress (uint memberIndex_, address newAddress_) public onlyMainAddress (memberIndex_) {
        _activeMembers[memberIndex_]._secondaryAddresses.push(newAddress_);
    }

    function removeSecondaryAddress (uint memberIndex_, address addressToBeRemoved_) public onlyMainAddress (memberIndex_) {
        // TODO: Implement
    }

    function changeMainAddress (uint memberIndex_) public onlySecondaryAddress(memberIndex_) {
        
        Member storage m = _activeMembers[memberIndex_];
        bytes32[] memory allRoles = _getAllRoles();

        for (uint i = 0; i < allRoles.length; i++) {

            uint memberCount = getRoleMemberCount(allRoles[i]);

            for (uint j = 0; j < memberCount; j++) {
                
                address roleMember = getRoleMember(allRoles[i], j);
                
                if (roleMember == m._mainAddress) {
                    _revokeRole(allRoles[i], m._mainAddress);
                    _grantRole(allRoles[i], msg.sender);
                }
            }
        }

        m._mainAddress = msg.sender;
        removeSecondaryAddress(m._id, msg.sender);
    }

    function proposeMemberInclusion (uint proposerIndex_, Member memory newMember_) public onlyMainAddress(proposerIndex_) onlyRole(MEMBER_MANAGER_ROLE) {

        if (_minApprovalsToAddNewMember <= 1) {
            _addNewMember(newMember_);
            return;
        }

        MemberProposal storage m = _memberInclusionProposals.push();
        m._id = _memberInclusionProposalsIncremental++;
        m._proposalType = ProposalType.INCLUSION;
        m._affectedMember = newMember_;
        m._approvals.push(_activeMembers[proposerIndex_]);
    }

    function proposeMemberExclusion (uint proposerIndex_, uint affectedMember_) public onlyMainAddress(proposerIndex_) onlyRole(MEMBER_MANAGER_ROLE) {
        //TODO: Implement
    }


    function approveMemberInclusionProposal (uint approverIndex_, uint memberProposalId_) public onlyMainAddress(approverIndex_) onlyRole(MEMBER_MANAGER_ROLE) {

        Member memory approver = _activeMembers[approverIndex_];
        MemberProposal storage mp = _memberInclusionProposals[0];
        bool approved = false;
        uint i = 0;

        for (i = 0; i < _memberInclusionProposals.length; i++) {

            mp = _memberInclusionProposals[i];

            if (mp._id == memberProposalId_) {

                require (mp._proposalType == ProposalType.INCLUSION, "This proposal is not a member inclusion proposal");

                for (uint j = 0; j < mp._approvals.length; j++) {
                    require (mp._approvals[j]._id != approver._id, "A member cannot approve a member inclusion proposal twice");
                }

                _memberInclusionProposals[i]._approvals.push(approver);
                approved = true;

                break;
            }
        }

        require (approved, "Member inclusion proposal not found");

        if (mp._approvals.length >= _minApprovalsToAddNewMember) {
            _addNewMember(mp._affectedMember);

            //Deleting approved proposal from the proposals list
            if (i == (_memberInclusionProposals.length - 1)) {
                _memberInclusionProposals.pop();

            } else {
                MemberProposal storage approvedProposal = _memberInclusionProposals[i];
                _memberInclusionProposals[i] = _memberInclusionProposals[_memberInclusionProposals.length - 1];
                _memberInclusionProposals[_memberInclusionProposals.length - 1] = approvedProposal;
                _memberInclusionProposals.pop();
            }
        }
    }

    function approveMemberExclusionProposal (uint approverIndex_, uint memberProposalId_) public onlyMainAddress(approverIndex_) onlyRole(MEMBER_MANAGER_ROLE) {
        //TODO: Implement
    }

}