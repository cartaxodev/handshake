// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

abstract contract MultimemberContract {
    
    //Members lists
    Member[] internal _membersList;
    uint private _membersCounter;

    //Contract Approvals
    mapping(uint => bool) private _contractApprovals;  // Member._id => approvalBoolean
    bool private _contractApproved;


    constructor (Member[] memory membersList_) {

        _membersCounter = 0;

        for (uint i = 0; i < membersList_.length; i++) {
            addNewMember(membersList_[i]);
        }
    }


    //** STRUCTS **//

    struct Member {

        uint _id; //This is a member ID valid only into the contract scope
        string _login;
        address payable _mainAddress;
        address payable[] _secondaryAddresses;
    }


    //** CUSTOM MODIFIERS **//

    modifier onlyMainAddress (uint memberIndex_) {
        require(_membersList[memberIndex_]._mainAddress == msg.sender, 
            'Only the main address of a member can call this function');
        _;
    }

    modifier onlySecondaryAddress (uint memberIndex_) {
        require (checkSecondaryAddress(memberIndex_, payable(msg.sender)), 
            'Only an allowed secondary address of a member can call this function');
        _;
    }

    modifier anyMemberAddress (uint memberIndex_) {
        require(
            _membersList[memberIndex_]._mainAddress == msg.sender
            || checkSecondaryAddress(memberIndex_, payable(msg.sender)),
                'Only the main address or an allowed secondary address of a member can call this function'
        );
        _;
    }

    modifier contractApprovedForAll {
        require(_contractApproved || updateContractApproval(), "This contract is not aproved by all members");
        _;
    }


    //** PUBLIC VIEW GETTERS **//

    function getMembers () public view returns (Member[] memory) {
        return _membersList;
    }


    function isContractApproved () public view returns (bool) {
        return _contractApproved;
    }


    /* Add a new member to the list of members */
    function addNewMember (Member memory newMember) internal {
        Member storage m = _membersList.push();
        
        m._id = _membersCounter++;
        m._login = newMember._login;
        m._mainAddress = newMember._mainAddress;
        m._secondaryAddresses = newMember._secondaryAddresses;

        _contractApproved = false; // Each new member needs to approve the contract
    }

    /* Function that sets the member approval to true */
    function approveTheContract (uint memberIndex_) public onlyMainAddress (memberIndex_) {
        require (_contractApprovals[memberIndex_] == false, "A member only can approve a contract once.");
        _contractApprovals[memberIndex_] = true;
    }

    /* Updates the contract approval flag */
    function updateContractApproval () private returns (bool) {

        bool approved = true;
        for (uint i = 0; i < _membersList.length; i++) {
            if (_contractApprovals[_membersList[i]._id] == false) {
                approved = false;
                break;
            }
        }
        _contractApproved = approved;
        return approved;
    }

    /* Functon to add a secondary address to the list of secondary addresses of the message sender */
    function addSecondaryAddress (uint memberIndex_, address payable newAddress_) public onlyMainAddress (memberIndex_) {
        _membersList[memberIndex_]._secondaryAddresses.push(newAddress_);
    }

     /* Removes a secondary address from the member's secondary addresses list */
    function removeSecondaryAddress (uint memberIndex_, address payable addressToBeRemoved_) public {
        // TODO: Implement
    }

    /* Changes the mains addres of a member. Requires a second address has already been registered */
    function changeMainAddress (uint memberIndex_) public onlySecondaryAddress(memberIndex_) {
        
        Member storage m = _membersList[memberIndex_];
        m._mainAddress = payable(msg.sender);
        removeSecondaryAddress(m._id, payable(msg.sender));

    }

    /* Checks if the secondary address is in the list of secondary addresses of the member */
    function checkSecondaryAddress (uint memberIndex_, address payable secondaryAddress_) internal view returns (bool) {
        bool allowed = false;
        Member storage m = _membersList[memberIndex_];

        for (uint i = 0; i < m._secondaryAddresses.length; i++) {
            if (m._secondaryAddresses[i] == secondaryAddress_) {
                allowed = true;
                break;
            }
        }

        return allowed;
    }



}