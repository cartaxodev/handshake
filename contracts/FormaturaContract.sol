// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract FormaturaContract {

    //Members lists
    Member[] private _membersList;

    //Financial rules
    AllowedCoins private _contractCoin;
    uint8 private _minCommitteMembersToWithdraw;
    uint private _withdrawalsCounter;
    uint private _maxWithdrawValue;
    Withdraw[] private _proposedWithdrawals;
    Withdraw[] private _executedWithdrawals;
    bool private _contractApproved;

    //Rules for penalties (multas, etc)
    //TODO

    //Rules for changing the contract
    //TODO

    //Rules for changing the members
    //TODO

    //Rules for blocking the contract
    //TODO

    //Rules for getting out the contract
    //TODO
    

    constructor (Member[] memory membersList_, 
                uint8 minCommitteMembersToWithdraw_, 
                uint maxWithdrawValue_) {

        _contractCoin = AllowedCoins.ETH;
        _withdrawalsCounter = 0;
        _minCommitteMembersToWithdraw = minCommitteMembersToWithdraw_;
        _maxWithdrawValue = maxWithdrawValue_;

        for (uint i = 0; i < membersList_.length; i++) {
            addNewMember(membersList_[i]);
        }
    }

    struct Member {

        string _login;
        address payable _mainAddress;
        address payable[] _secondaryAddresses;
        bool _contractApproved;
        bool _committeMember;
        Payment[] _payments;
    }

    struct Payment {

        uint _value;   // <-- Must be different to zero
        uint _dueDate;     //block.timestamp() --- from unix epoch
        uint _paymentDate;
        bool _paid;
    }

    struct Withdraw {

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

    enum AllowedCoins {
        ETH,
        USDC
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

    modifier coinETH {
        require(_contractCoin == AllowedCoins.ETH, 
            'The contract coin must be ETH to call this function');
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

    /* ------------------------------------  PRIVATE FUNCTIONS -------------------------------- */

    /* Add a new member to the list of members */
    function addNewMember (Member memory newMember) private {
        Member storage m = _membersList.push();
        
        m._login = newMember._login;
        m._mainAddress = newMember._mainAddress;
        m._secondaryAddresses = newMember._secondaryAddresses;
        m._committeMember = newMember._committeMember;
        m._contractApproved = false;

        for (uint i = 0; i < newMember._payments.length; i++) {
            require (newMember._payments[i]._value > 0, "All payments must have a value greater than zero");
            m._payments.push(newMember._payments[i]);
        }
    }
    

    /* Checks if the secondary address is in the list of secondary addresses of the member */
    function checkSecondaryAddress (uint8 memberIndex_, address payable secondaryAddress_) private view returns (bool) {
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


    function removeSecondaryAddress (Member storage m, address payable addressToBeRemoved_) private {
        // TODO: Implement
    }


    function getNextPendingPayment (uint8 memberIndex_) internal view returns (Payment storage) {
        
        Member storage member = _membersList[memberIndex_];
        Payment[] storage payments = member._payments;

        uint i;

        Payment memory p;
        bool havePendingPayments = false;

        for (i = 0; i < payments.length; i++) {
            if (payments[i]._paid == false) {
                p = payments[i];
                havePendingPayments = true;
                break;
            }
        }

        require(havePendingPayments , 'This member has not pending payments anymore');

        return payments[i];
    }

    /* ----------------------------- PUBLIC GETTERS --------------------------------------------- */


    function getMembers () public view returns (Member[] memory) {
        return _membersList;
    }

    function getContractCoin () public view returns (AllowedCoins) {
        return _contractCoin;
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

    function getProposedWithdrawals () public view returns (Withdraw[] memory) {
        return _proposedWithdrawals;
    }

    function getExecutedWithdrawals () public view returns (Withdraw[] memory) {
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

    function getContractBalance_ETH () public view returns (uint) {
        return address(this).balance;
    }

    function checkBalanceWithPayments_ETH () public view returns (bool) {
        uint sumOfPayments = 0;

        for (uint i = 0; i < _membersList.length; i++) {

            Payment[] storage p = _membersList[i]._payments;

            for (uint j = 0; j < p.length; j++) {

                if (p[j]._paymentDate != 0) {
                    sumOfPayments += p[j]._value;
                }
            }
        }
        
        uint sumOfWithdrawals = 0;

        for (uint i; i < _executedWithdrawals.length; i++) {
            sumOfWithdrawals += _executedWithdrawals[i]._value;
        }

        if ((sumOfPayments - sumOfWithdrawals) == getContractBalance_ETH()) {
            return true;
        } else {
            return false;
        }

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


    function getNextPaymentDueDate (uint8 memberIndex_) public view returns (uint) {
        Payment memory nextPayment = getNextPendingPayment(memberIndex_);
        return nextPayment._dueDate;
    }


    function getRemainingDebt (uint8 memberIndex_) public view returns (uint) {
        Payment[] memory p = _membersList[memberIndex_]._payments;

        uint remainingValue = 0;

        for (uint i; i < p.length; i++) {
            if (p[i]._paid == false) {
                remainingValue += p[i]._value;
            }
        }
        return remainingValue;
    }


    function getPaidValue (uint8 memberIndex_) public view returns (uint) {
        Payment[] memory p = _membersList[memberIndex_]._payments;

        uint paidValue = 0;

        for (uint i; i < p.length; i++) {
            if (p[i]._paid == true) {
                paidValue += p[i]._value;
            }
        }
        return paidValue;
    }


    function getContractTotalValue () public view returns (uint) {
        
        uint contractTotalValue = 0;
        
        for (uint i = 0; i < _membersList.length; i++) {

            Payment[] storage p = _membersList[i]._payments;

            for (uint j = 0; j < p.length; j++) {
                contractTotalValue += p[j]._value;
            }
        }

        return contractTotalValue;
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


    /* --------------------------------- FINANCIAL TRANSACTIONS FUNCTIONS (ETH) ------------------------------ */

    function payNextPayment_ETH (uint8 memberIndex_) public payable contractApprovedForAll anyMemberAddress(memberIndex_) coinETH {
        Payment storage nextPayment = getNextPendingPayment(memberIndex_);
        require(msg.value == nextPayment._value, 'The transaction value must be equal to the payment value');
        nextPayment._paymentDate = block.timestamp;
        nextPayment._paid = true;
    }
    
    function proposeWithdraw_ETH (uint8 proposerIndex_, uint value_, string memory objective_, address payable destination_) public onlyCommitte(proposerIndex_) onlyMainAddress(proposerIndex_) {

        require(value_ <= getContractBalance_ETH(), 
            'Withdraw value must be equal or less than the contract balance');

        require(value_ <= _maxWithdrawValue, 
            'Withdraw value must be equal or less than the maximum defined in this contract');

        Withdraw storage newWithdraw = _proposedWithdrawals.push();

        newWithdraw._id = _withdrawalsCounter;
        newWithdraw._proposer = _membersList[proposerIndex_];
        newWithdraw._value = value_;
        newWithdraw._objective = objective_;
        newWithdraw._destination = destination_;

        newWithdraw._authorizations.push(_membersList[proposerIndex_]);
        //newWithdraw._authorizationsCounter++;
        _withdrawalsCounter++;
    }


    function authorizeWithdraw_ETH (uint8 authorizerIndex_, uint withdrawId_) public onlyCommitte(authorizerIndex_) onlyMainAddress(authorizerIndex_) {

        for (uint i = 0; i < _proposedWithdrawals.length; i++) {
            if (_proposedWithdrawals[i]._id == withdrawId_) {
                _proposedWithdrawals[i]._authorizations.push(_membersList[authorizerIndex_]);
                //_proposedWithdrawals[i]._authorizationsCounter++;

                if (_proposedWithdrawals[i]._authorizations.length >= _minCommitteMembersToWithdraw) {
                    _proposedWithdrawals[i]._authorized = true;
                }
                break;
            }
        }

    }


    function executeWithdraw_ETH (uint8 memberIndex_, uint withdrawId_) public onlyCommitte(memberIndex_) onlyMainAddress(memberIndex_) {

        uint i;
        Withdraw storage executedWithdraw;

        for (i = 0; i < _proposedWithdrawals.length; i++) {

            Withdraw storage w = _proposedWithdrawals[i];

            if (w._id == withdrawId_ && w._authorized) {

                require(w._value <= getContractBalance_ETH(), "This contract haven't enough balance to execute this transaction");
                executedWithdraw = w;
                executedWithdraw._destination.transfer(w._value);
                executedWithdraw._executed = true;
                executedWithdraw._executionTimestamp = block.timestamp;

                _executedWithdrawals.push(executedWithdraw);

                break;
            }
        }

        //Deleting executed withdraw from proposed withdrawals list
        if (i == (_proposedWithdrawals.length - 1)) {
            _proposedWithdrawals.pop();

        } else {
            Withdraw storage executed = _proposedWithdrawals[i];
            _proposedWithdrawals[i] = _proposedWithdrawals[_proposedWithdrawals.length - 1];
            _proposedWithdrawals[_proposedWithdrawals.length - 1] = executed;
            _proposedWithdrawals.pop();
        }

    }

}