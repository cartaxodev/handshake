// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "./../util/AccessControlUtils.sol";
import "./HandshakeSuperClass_Structs.sol";

abstract contract HandshakeSuperClass is  AccessControlEnumerable, AccessControlUtils {
    
    //Objective of this contract
    string private _objective;

    //Members
    MemberMap internal _members;
    uint private _memberIdIncremental;

    //Contract Approvals
    mapping(uint => bool) private _contractApprovals;  // Member._id => approvalBoolean
    bool private _contractApproved;

    //Deposits
    Deposit[] private _depositsList;
    uint private _depositsIncremental;
    
    //Withdrawals
    Withdrawal[] private _withdrawalsList;
    uint private _withdrawalsIncremental;

    //Allowed-access Feature Proxies
    address[] public _featureProxies;

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
    
    modifier onlyMainAddress (uint memberId_) {
        require(_checkMainAddress(memberId_, msg.sender), 
            'Only the main address of an active member can call this function');
        _;
    }

    modifier onlySecondaryAddress (uint memberId_) {
        require (_checkSecondaryAddress(memberId_, msg.sender), 
            'Only an allowed secondary address of an active member can call this function');
        _;
    }

    modifier contractApprovedForAll {
        require(_contractApproved, "This contract is not aproved by all active members");
        _;
    }


    /* PUBLIC VIEW GETTERS */

    function getActiveMembers () public view returns (Member[] memory) {
        Member[] memory result = new Member[](_members._activeIds.length);
        for (uint i = 0; i < _members._activeIds.length; i++) {
            result[i] = _members._values[_members._activeIds[i]];
        }
        return result;
    }

    function getMemberById (uint memberId_) public view returns (Member memory) {
        return _members._values[memberId_];
    }

    function getMemberId (address memberMainAddress_) public view returns (uint) {
        uint8 i = 0;
        bool found = false;
        uint id = 0;

        for (i = 0; i < _members._activeIds.length; i++) {
            if (_members._values[_members._activeIds[i]]._mainAddress == memberMainAddress_) {
                found = true;
                id = _members._activeIds[i];
                break;
            }
        }

        require(found == true, 'This address is not a main address of an active member');

        return id;
    }

    function isContractApproved () public view returns (bool) {
        return _contractApproved;
    }

    function getMemberApproval (uint memberId_) public view returns (bool) {
        return _contractApprovals[memberId_];
    }

     function getWithdrawals () public view returns (Withdrawal[] memory) {
        return _withdrawalsList;
    }

    function getDeposits () public view returns (Deposit[] memory) {
        return _depositsList;
    }

    function getFeatureProxies() public view returns (address[] memory) {
        return _featureProxies;
    }


    /* PRIVATE FUNCTIONS */

    function _addNewMember (Member memory newMember_) private {
        
        /* Testing if all addresses used by the member are unike in this contract - 
        i.e. None of the members had used this address before*/
        require (_members._usedAddresses[newMember_._mainAddress] == false, "This address is already in use");
        _members._usedAddresses[newMember_._mainAddress] = true;

        for (uint i=0; i < newMember_._secondaryAddresses.length; i++) {
            require (_members._usedAddresses[newMember_._secondaryAddresses[i]] == false, "This address is already in use");
            _members._usedAddresses[newMember_._secondaryAddresses[i]] = true;
        }

        uint memberId = _memberIdIncremental++;
        Member storage m = _members._values[memberId];  //Creating the member into the mapping
        _members._activeIds.push(memberId);                   //Registering member ID into the array
        
        m._id = memberId;
        m._login = newMember_._login;
        m._mainAddress = newMember_._mainAddress;
        m._secondaryAddresses = newMember_._secondaryAddresses;

        _contractApproved = false; // Each new active member needs to approve the contract
    }

    function _checkMainAddress (uint memberId_, address mainAddress_) private view returns (bool) {
        return (_members._values[memberId_]._mainAddress == mainAddress_);
    }

    function _checkSecondaryAddress (uint memberId_, address secondaryAddress_) private view  returns (bool) {
        bool allowed = false;
        Member storage m = _members._values[memberId_];

        for (uint i = 0; i < m._secondaryAddresses.length; i++) {
            if (m._secondaryAddresses[i] == secondaryAddress_) {
                allowed = true;
                break;
            }
        }

        return allowed;
    }

    function _updateContractApproval () private returns (bool) {

        bool approved = true;
        for (uint i = 0; i < _members._activeIds.length; i++) {
            if (_contractApprovals[_members._activeIds[i]] == false) {
                approved = false;
                break;
            }
        }
        _contractApproved = approved;
        return approved;
    }

    function _grantFeatureRole (address featureAddress_) internal {
        _grantRole(INTERNAL_FEATURE_ROLE, featureAddress_);
        _featureProxies.push(featureAddress_);
    }

    function _registerDeposit (address from_, uint value_, uint depositTimestamp_) internal returns (uint) {
        
        Deposit memory deposit = Deposit({
            _id: _depositsIncremental++,
            _from: from_,
            _value: value_,
            _depositTimestamp: depositTimestamp_
        });

        _depositsList.push(deposit);

        return deposit._id;
    }

    function _registerWithdrawal (address to_, uint value_, uint withdrawalTimestamp_) internal returns (uint) {
        
        Withdrawal memory withdrawal = Withdrawal({
            _id: _withdrawalsIncremental++,
            _to: to_,
            _value: value_,
            _withdrawalTimestamp: withdrawalTimestamp_
        });

        _withdrawalsList.push(withdrawal);

        return withdrawal._id;
    }

    /* FEATURES ACCESSIBLE FUNCTIONS */

    function __addNewMember(Member memory newMember_) public onlyInternalFeature {
        _addNewMember(newMember_);
    }

    function __checkMainAddress (uint memberId_, address mainAddress_) public view onlyInternalFeature returns (bool) {
        return _checkMainAddress(memberId_, mainAddress_);
    }

    function __checkSecondaryAddress (uint memberId_, address secondaryAddress_) public view onlyInternalFeature returns (bool) {
        return _checkSecondaryAddress(memberId_, secondaryAddress_);
    }

    function __deposit (address payable from_, uint value_) virtual public payable returns (uint);

    function __withdraw (address payable to_, uint value_) virtual public returns (uint);


    //** PUBLIC API */

    function approveTheContract (uint memberId_) public onlyMainAddress (memberId_) {
        require (_contractApprovals[memberId_] == false, "A member only can approve a contract once.");
        _contractApprovals[memberId_] = true;
        _updateContractApproval();
    }

    function addSecondaryAddress (uint memberId_, address newAddress_) public onlyMainAddress (memberId_) {
        require (_members._usedAddresses[newAddress_] == false, "This address is already in use");
        _members._values[memberId_]._secondaryAddresses.push(newAddress_);
        _members._usedAddresses[newAddress_] = true;
    }

    function removeSecondaryAddress (uint memberId_, address addressToBeRemoved_) public onlyMainAddress (memberId_) {
        // TODO: Implement

        address[] storage secondaryAddresses = _members._values[memberId_]._secondaryAddresses;
        uint i = 0;
        bool found = false;

        for (i=0; i < secondaryAddresses.length; i++) {
            if (secondaryAddresses[i] == addressToBeRemoved_) {
                found = true;
                break;
            }
        }
        
        require(found == true, "Address not found");
        if (i == (secondaryAddresses.length - 1)) {
            secondaryAddresses.pop();

        } else {
            secondaryAddresses[i] = secondaryAddresses[secondaryAddresses.length - 1];
            secondaryAddresses.pop();
        }
        _members._usedAddresses[addressToBeRemoved_] = false;
    }

    function changeMainAddress (uint memberId_) public onlySecondaryAddress(memberId_) {
        
        Member storage m = _members._values[memberId_];
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

    function getTokenType () virtual public view returns (AllowedTokens);
    
    function getContractBalance () virtual public view returns (uint);

}