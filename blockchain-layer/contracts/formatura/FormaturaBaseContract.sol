// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

abstract contract FormaturaBaseContract {

    //Members lists
    Member[] internal _membersList;
    uint internal _membersCounter;

    //Financial rules
    uint8 internal _minCommitteMembersToWithdraw;
    uint internal _withdrawalsCounter;
    uint internal _maxWithdrawValue;
    Withdrawal[] internal _proposedWithdrawals;
    Withdrawal[] internal _executedWithdrawals;
    bool internal _contractApproved;

    //Rules duedate control and execution of penalties (multas, etc)
    //TODO

    //Rules for making changes on the contract
    //TODO

    //Rules for changing the members
    //TODO

    //Rules for blocking the contract
    //TODO

    //Rules for getting out the contract
    //TODO

    //Rules for specifying withdrawals schedule
    //TODO
    

    constructor (Member[] memory membersList_, 
                uint8 minCommitteMembersToWithdraw_, 
                uint maxWithdrawValue_) {

        //_contractCoin = contractCoin_;
        _withdrawalsCounter = 0;
        _minCommitteMembersToWithdraw = minCommitteMembersToWithdraw_;
        _maxWithdrawValue = maxWithdrawValue_;

        for (uint i = 0; i < membersList_.length; i++) {
            addNewMember(membersList_[i]);
        }
    }

    struct Member {

        uint _id; //This is a member ID valid only into the contract scope
        string _login;
        address payable _mainAddress;
        address payable[] _secondaryAddresses;
        bool _contractApproved;
        bool _committeMember;
        Deposit[] _deposits;
    }

    struct Deposit {

        uint _value;   // <-- Must be different to zero
        uint _dueDate;     //block.timestamp() --- from unix epoch
        uint _depositDate;
        bool _paid;
    }

    struct Withdrawal {

        uint _id;
        Member _proposer;
        Member[] _authorizations;
        //uint _authorizationsCounter;
        uint _value;
        string _objective;
        address payable _destination;
        bool _authorized;
        bool _executed;
        uint _executionTimestamp;
    }

    enum AllowedTokens {
        ETH,
        ERC20
    }


    /* ------------------------------------ CUSTOM MODIFIERS ----------------------------------- */

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

    modifier onlyCommitte (uint8 memberIndex_) {
        require(_membersList[memberIndex_]._committeMember, 
            'Only committe members can call this function');
        _;
    }

    modifier contractApprovedForAll {
        require(_contractApproved || updateContractApproval(), "This contract is not aproved by all members");
        _;
    }

    /* ------------------------------------  INTERNAL FUNCTIONS -------------------------------- */

    /* Add a new member to the list of members */
    function addNewMember (Member memory newMember) internal {
        Member storage m = _membersList.push();
        
        m._id = _membersCounter++;
        m._login = newMember._login;
        m._mainAddress = newMember._mainAddress;
        m._secondaryAddresses = newMember._secondaryAddresses;
        m._committeMember = newMember._committeMember;
        m._contractApproved = false;

        for (uint i = 0; i < newMember._deposits.length; i++) {
            require (newMember._deposits[i]._value > 0, "All deposits must have a value greater than zero");
            m._deposits.push(newMember._deposits[i]);
        }
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


    function removeSecondaryAddress (Member storage m, address payable addressToBeRemoved_) internal {
        // TODO: Implement
    }


    function getNextPendingDeposit (uint8 memberIndex_) internal view returns (Deposit storage) {
        
        Member storage member = _membersList[memberIndex_];
        Deposit[] storage deposits = member._deposits;

        uint i;

        Deposit memory p;
        bool havePendingDeposits = false;

        for (i = 0; i < deposits.length; i++) {
            if (deposits[i]._paid == false) {
                p = deposits[i];
                havePendingDeposits = true;
                break;
            }
        }

        require(havePendingDeposits , 'This member has not pending deposits anymore');

        return deposits[i];
    }

    /* ----------------------------- PUBLIC GETTERS --------------------------------------------- */


    function getMembers () public view returns (Member[] memory) {
        return _membersList;
    }

    function getMinCommitteMembersToWithdraw () public view returns (uint8) {
        return _minCommitteMembersToWithdraw;
    }

    function getWithdrawalsCounter () public view returns (uint) {
        return _withdrawalsCounter;
    }

    function getMaxWithdrawValue () public view returns (uint) {
        return _maxWithdrawValue;
    }

    function getProposedWithdrawals () public view returns (Withdrawal[] memory) {
        return _proposedWithdrawals;
    }

    function getExecutedWithdrawals () public view returns (Withdrawal[] memory) {
        return _executedWithdrawals;
    }

    /* ----------------------------- PUBLIC VIEW FUNCTIONS -------------------------------------- */

    function getMemberIndex (address payable memberAddress_) public view returns (uint8) {
        uint8 i = 0;
        bool found = false;

        for (i = 0; i < _membersList.length; i++) {
            if (_membersList[i]._mainAddress == memberAddress_) {
                found = true;
                break;
            }
        }

        require(found == true, 'This address is not a main address of a member of this contract');

        return i;
    }

    function updateContractApproval () public returns (bool) {

        bool approved = true;
        for (uint i = 0; i < _membersList.length; i++) {
            if (!_membersList[i]._contractApproved) {
                approved = false;
                break;
            }
        }
        _contractApproved = approved;
        return approved;
        
    }


    function getNextDepositDueDate (uint8 memberIndex_) public view returns (uint) {
        Deposit memory nextDeposit = getNextPendingDeposit(memberIndex_);
        return nextDeposit._dueDate;
    }


    function getRemainingDebt (uint8 memberIndex_) public view returns (uint) {
        Deposit[] memory deposits = _membersList[memberIndex_]._deposits;

        uint remainingValue = 0;

        for (uint i; i < deposits.length; i++) {
            if (deposits[i]._paid == false) {
                remainingValue += deposits[i]._value;
            }
        }
        return remainingValue;
    }


    function getDepositedValue (uint8 memberIndex_) public view returns (uint) {
        Deposit[] memory deposits = _membersList[memberIndex_]._deposits;

        uint depositedValue = 0;

        for (uint i; i < deposits.length; i++) {
            if (deposits[i]._paid == true) {
                depositedValue += deposits[i]._value;
            }
        }
        return depositedValue;
    }


    function getContractTotalValue () public view returns (uint) {
        
        uint contractTotalValue = 0;
        
        for (uint i = 0; i < _membersList.length; i++) {

            Deposit[] storage d = _membersList[i]._deposits;

            for (uint j = 0; j < d.length; j++) {
                contractTotalValue += d[j]._value;
            }
        }

        return contractTotalValue;
    }

    function checkBalanceWithDeposits () public view returns (bool) {
        uint sumOfDeposits = 0;

        for (uint i = 0; i < _membersList.length; i++) {

            Deposit[] storage deposits = _membersList[i]._deposits;

            for (uint j = 0; j < deposits.length; j++) {

                if (deposits[j]._depositDate != 0) {
                    sumOfDeposits += deposits[j]._value;
                }
            }
        }
        
        uint sumOfWithdrawals = 0;

        for (uint i; i < _executedWithdrawals.length; i++) {
            sumOfWithdrawals += _executedWithdrawals[i]._value;
        }

        if ((sumOfDeposits - sumOfWithdrawals) == getContractBalance()) {
            return true;
        } else {
            return false;
        }

    }


    /* ----------------------------- FUNCTIONS TO MEMBER ACCOUNT MANAGEMENT ------------------------ */


    function approveTheContract (uint8 memberIndex_) public onlyMainAddress (memberIndex_) {
        Member storage m = _membersList[memberIndex_];
        require(m._contractApproved == false);
        m._contractApproved = true;
    }


    /* Functon to add a secondary address to the list of secondary addresses of the message sender */
    function addSecondaryAddress (uint8 memberIndex_, address payable newAddress_) public onlyMainAddress (memberIndex_) {
        _membersList[memberIndex_]._secondaryAddresses.push(newAddress_);
    }


    function changeMainAddress (uint8 memberIndex_) public onlySecondaryAddress(memberIndex_) {
        
        Member storage m = _membersList[memberIndex_];
        m._mainAddress = payable(msg.sender);
        removeSecondaryAddress(m, payable(msg.sender));

    }

    /* ------------------------ ABSTRACT FUNCTIONS - Implementations must change deoending of coin (ETH or ERC20) ---------- */

    function getTokenType () virtual public view returns (AllowedTokens);
    
    function getContractBalance () virtual public view returns (uint);

    function deposit (uint depositValue_) virtual internal;

    function withdraw(address payable destination_, uint value_) virtual internal;


   
    /* --------------------------------- FINANCIAL TRANSACTIONS FUNCTIONS (ETH) ------------------------------ */

    function payNextDeposit (uint8 memberIndex_) public payable contractApprovedForAll anyMemberAddress(memberIndex_) {
        Deposit storage nextDeposit = getNextPendingDeposit(memberIndex_);
        deposit(nextDeposit._value);
        nextDeposit._depositDate = block.timestamp;
        nextDeposit._paid = true;
    }
    
    function proposeWithdrawal (uint8 proposerIndex_, uint value_, string memory objective_, address payable destination_) public onlyCommitte(proposerIndex_) onlyMainAddress(proposerIndex_) {

        require(value_ <= getContractBalance(), 
            'Withdrawal value must be equal or less than the contract balance');

        require(value_ <= _maxWithdrawValue, 
            'Withdrawal value must be equal or less than the maximum defined in this contract');

        Withdrawal storage newWithdraw = _proposedWithdrawals.push();

        newWithdraw._id = _withdrawalsCounter;
        newWithdraw._proposer = _membersList[proposerIndex_];
        newWithdraw._value = value_;
        newWithdraw._objective = objective_;
        newWithdraw._destination = destination_;

        newWithdraw._authorizations.push(_membersList[proposerIndex_]);
        _withdrawalsCounter++;
    }


    function authorizeWithdrawal (uint8 authorizerIndex_, uint withdrawId_) public onlyCommitte(authorizerIndex_) onlyMainAddress(authorizerIndex_) {

        for (uint i = 0; i < _proposedWithdrawals.length; i++) {
            if (_proposedWithdrawals[i]._id == withdrawId_) {
                
                Withdrawal storage withdrawal = _proposedWithdrawals[i];
                Member storage authorizer = _membersList[authorizerIndex_];

                for (uint j = 0; j < withdrawal._authorizations.length; j++) {
                    require (withdrawal._authorizations[j]._id != authorizer._id, "A member cannot authorize a withdrawal twice");
                }

                withdrawal._authorizations.push(authorizer);

                if (withdrawal._authorizations.length >= _minCommitteMembersToWithdraw) {
                    withdrawal._authorized = true;
                }
                break;
            }
        }

    }


    function executeWithdrawal (uint8 memberIndex_, uint withdrawalId_) public onlyCommitte(memberIndex_) onlyMainAddress(memberIndex_) {

        uint i;
        bool executed = false;

        for (i = 0; i < _proposedWithdrawals.length; i++) {

            Withdrawal storage w = _proposedWithdrawals[i];

            if (w._id == withdrawalId_) {

                require(w._authorized && !w._executed, "A withdrawal must be authorized and not executed yet, to be executed");
                require(w._value <= getContractBalance(), "There is not enough balance in this contract to execute this transaction");
                
                w._executed = true;
                w._executionTimestamp = block.timestamp;

                executed = true;
                _executedWithdrawals.push(w);

                withdraw(w._destination, w._value);
                
                break;
            }
        }

        require (executed, "Proposed withdrawal not found");
        //Deleting executed withdraw from proposed withdrawals list
        if (i == (_proposedWithdrawals.length - 1)) {
            _proposedWithdrawals.pop();

        } else {
            Withdrawal storage execWithdraw = _proposedWithdrawals[i];
            _proposedWithdrawals[i] = _proposedWithdrawals[_proposedWithdrawals.length - 1];
            _proposedWithdrawals[_proposedWithdrawals.length - 1] = execWithdraw;
            _proposedWithdrawals.pop();
        }
    }

}