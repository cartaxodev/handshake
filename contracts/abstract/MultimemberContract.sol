// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "./../util/AccessControlUtils.sol";

abstract contract MultimemberContract is AccessControlEnumerable, AccessControlUtils {
    
    //Objective of this contract
    string internal _objective;

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


    constructor (string memory objective_,
                 Member[] memory membersList_, 
                 address[] memory memberManagers_) {

        _objective = objective_;
        _memberIdIncremental = 0;

        for (uint i = 0; i < membersList_.length; i++) {
            _addNewMember(membersList_[i]);
        }

        for (uint i = 0; i < memberManagers_.length; i++) {
            _grantRole(MEMBER_MANAGER_ROLE, memberManagers_[i]);
        }
    }


    //** STRUCTS **//

    struct Member {

        uint _id; //This is a member ID valid only into the contract scope
        string _login;
        address _mainAddress;
        address[] _secondaryAddresses;
    }

    struct MemberProposal {

        uint _id;
        ProposalType _proposalType;
        Member _affectedMember;
        Member[] _approvals;
    }

    enum ProposalType {
        INCLUSION,
        EXCLUSION
    }


    //** CUSTOM MODIFIERS **//

    modifier onlyMainAddress (uint memberIndex_) {
        require(_activeMembers[memberIndex_]._mainAddress == msg.sender, 
            'Only the main address of an active member can call this function');
        _;
    }

    modifier onlySecondaryAddress (uint memberIndex_) {
        require (checkSecondaryAddress(memberIndex_, msg.sender), 
            'Only an allowed secondary address of an active member can call this function');
        _;
    }

    modifier anyMemberAddress (uint memberIndex_) {
        require(
            _activeMembers[memberIndex_]._mainAddress == msg.sender
            || checkSecondaryAddress(memberIndex_, msg.sender),
                'Only the main address or an allowed secondary address of an active member can call this function'
        );
        _;
    }

    modifier contractApprovedForAll {
        require(_contractApproved || _updateContractApproval(), "This contract is not aproved by all active members");
        _;
    }


    //** PUBLIC VIEW GETTERS **//

    function getMembers () public view returns (Member[] memory) {
        return _activeMembers;
    }


    function isContractApproved () public view returns (bool) {
        return _contractApproved;
    }


    //** INTERNAL METHODS */

    /* Add a new member in active members list */
    function _addNewMember (Member memory newMember_) internal {
        Member storage m = _activeMembers.push();
        
        m._id = _memberIdIncremental++;
        m._login = newMember_._login;
        m._mainAddress = newMember_._mainAddress;
        m._secondaryAddresses = newMember_._secondaryAddresses;

        _contractApproved = false; // Each new active member needs to approve the contract
    }

     /* Updates the contract approval flag */
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

    /* Checks if the secondary address is in the list of secondary addresses of the member */
    function checkSecondaryAddress (uint memberIndex_, address secondaryAddress_) internal view returns (bool) {
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


    //** PUBLIC API */

    /* Function that sets the member approval to true */
    function approveTheContract (uint memberIndex_) public onlyMainAddress (memberIndex_) {
        require (_contractApprovals[memberIndex_] == false, "A member only can approve a contract once.");
        _contractApprovals[memberIndex_] = true;
    }

    /* Functon to add a secondary address to the list of secondary addresses of the message sender */
    function addSecondaryAddress (uint memberIndex_, address newAddress_) public onlyMainAddress (memberIndex_) {
        _activeMembers[memberIndex_]._secondaryAddresses.push(newAddress_);
    }

     /* Removes a secondary address from the member's secondary addresses list */
    function removeSecondaryAddress (uint memberIndex_, address addressToBeRemoved_) public onlyMainAddress (memberIndex_) {
        // TODO: Implement
    }

    /* Changes the main address of an active member. 
    Requires a second address (msg.sender) has already been registered */
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

    /* Proposes the inclusion of a new member in this contract.
    If the number os approvals required to add a new member is equal or less than one, the new member is directly added. */
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