// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "./../../patterns/FeatureLogic.sol";
import "./MemberListController_Structs.sol";

contract MemberListController_Logic is FeatureLogic {

    //Member inclusion proposals
    MemberProposal[] private _memberInclusionProposals;
    uint private _memberInclusionProposalsIncremental;
    uint private _minApprovalsToAddNewMember;

     //Member exclusion proposals
    MemberProposal[] private _memberExclusionProposals;
    uint private _memberExclusionProposalsIncremental;
    uint private _minApprovalsToRemoveMember;

    /* CONTRACT INITIALIZATION FUNCTON 
        IT MUST BE CALLED BY THE PROXY CONTRACT CONSTRUCTOR */
    function initializeFeature (address concreteContractAddress_,
                                Member[] memory membersList_,
                                address[] memory memberManagers_,
                                uint minApprovalsToAddNewMember_,
                                uint minApprovalsToRemoveMember_
                                    ) external initializer {
      
        _initializeLogic(concreteContractAddress_);
        
        require (minApprovalsToAddNewMember_ > 0 && minApprovalsToRemoveMember_ > 0, 
                "The number of necessary approvals to make changes in member list must be greater than zero");
                
        _minApprovalsToAddNewMember = minApprovalsToAddNewMember_;
        _minApprovalsToRemoveMember = minApprovalsToRemoveMember_;

        _checkManagersAsMembers(memberManagers_, membersList_);
    }

    /* INTERNAL FUNCTIONS */

    function _checkManagersAsMembers(address[] memory managers_, Member[] memory membersList_) private pure {
        for (uint i = 0; i < managers_.length; i++) {
            bool managerIsMember = false;
            for (uint j = 0; j < membersList_.length; j++) {
                if (managers_[i] == membersList_[j]._mainAddress) {
                    managerIsMember = true;
                }
            }
            require (managerIsMember, "One (or more) manager is not an active member");
        }
    }

    function proposeMemberInclusion (uint proposerId_, Member memory newMember_) public onlyMainAddress(proposerId_) onlyRole(MEMBER_MANAGER_ROLE) {

        if (_minApprovalsToAddNewMember <= 1) {
            _concreteContract.__addNewMember(newMember_);
            return;
        }

        MemberProposal storage m = _memberInclusionProposals.push();
        m._id = _memberInclusionProposalsIncremental++;
        m._proposalType = ProposalType.INCLUSION;
        m._affectedMember = newMember_;
        m._approvals.push(_concreteContract.getMemberById(proposerId_));
    }

    function proposeMemberExclusion (uint proposerId_, uint affectedMember_) public onlyMainAddress(proposerId_) onlyRole(MEMBER_MANAGER_ROLE) {
        //TODO: Implement
    }


    function approveMemberInclusionProposal (uint approverId_, uint memberProposalId_) public onlyMainAddress(approverId_) onlyRole(MEMBER_MANAGER_ROLE) {

        Member memory approver = _concreteContract.getMemberById(approverId_);
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
            _concreteContract.__addNewMember(mp._affectedMember);

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

    function approveMemberExclusionProposal (uint approverId_, uint memberProposalId_) public onlyMainAddress(approverId_) onlyRole(MEMBER_MANAGER_ROLE) {
        //TODO: Implement
        // LEMBRAR DE EXCLUIR O ID DO ARRAY _ids
        // LEMBRAR DE EXCLUIR O MEMBER DO MAPPING _values
        // LEMBRAR DE EXCLUIR TODAS AS ROLES
    }

}