// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

abstract contract BankAccount {

    //Members lists
    Member[] internal _membersList;
    uint internal _membersCounter;

    //Deposits
    Deposit[] internal _depositsList;
    uint internal _depositsCounter;
    
    //Withdrawals
    Withdrawal[] internal _withdrawalsList;
    uint internal _withdrawalsCounter;


    constructor (Member[] memory membersList_) {

        _membersCounter = 0;
        _depositsCounter = 0;
        _withdrawalsCounter = 0;

        for (uint i = 0; i < membersList_.length; i++) {
            addNewMember(membersList_[i]);
        }
    }


    //** STRUCTS **/

    struct Member {

        uint _id; //This is a member ID valid only into the contract scope
        string _login;
        address payable _mainAddress;
        address payable[] _secondaryAddresses;
    }

    struct Deposit {
        uint _id;
        address _from;
        uint _value;  
        uint _depositTimestamp;
    }

    struct Withdrawal {
        uint _id;
        address _to;
        uint _value;
        uint _withdrawTimestamp;
    }


    //** CUSTOM MODIFIERS **/

    modifier onlyMainAddress (uint8 memberIndex_) {
        require(_membersList[memberIndex_]._mainAddress == msg.sender, 
            'Only the main address of a member can call this function');
        _;
    }

    modifier onlySecondaryAddress (uint8 memberIndex_) {
        require (checkSecondaryAddress(memberIndex_, payable(msg.sender)), 
            'Only an allowed secondary address of a member can call this function');
        _;
    }

    modifier anyMemberAddress (uint8 memberIndex_) {
        require(
            _membersList[memberIndex_]._mainAddress == msg.sender
            || checkSecondaryAddress(memberIndex_, payable(msg.sender)),
                'Only the main address or an allowed secondary address of a member can call this function'
        );
        _;
    }


    //** PUBLIC VIEW GETTERS **/

    function getMembers () public view returns (Member[] memory) {
        return _membersList;
    }

    function getWithdrawals () public view returns (Withdrawal[] memory) {
        return _withdrawalsList;
    }

    function getDeposits () public view returns (Deposit[] memory) {
        return _depositsList;
    }


    /* Add a new member to the list of members */
    function addNewMember (Member memory newMember) internal {
        Member storage m = _membersList.push();
        
        m._id = _membersCounter++;
        m._login = newMember._login;
        m._mainAddress = newMember._mainAddress;
        m._secondaryAddresses = newMember._secondaryAddresses;
    }

    /* Checks if the secondary address is in the list of secondary addresses of the member */
    function checkSecondaryAddress (uint8 memberIndex_, address payable secondaryAddress_) internal view returns (bool) {
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

    /* Removes a secondary address from the member's secondary addresses list */
    function removeSecondaryAddress (Member storage m, address payable addressToBeRemoved_) internal {
        // TODO: Implement
    }

}