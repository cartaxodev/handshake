// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

contract FormaturaContract {

    //Members lists
    mapping (address => Member) private _membersMap;
    Member[] private _membersList;

    //Financial rules
    AllowedCoins private _contractCoin;
    uint8 private _minCommitteMembersToWithdraw;
    uint private _withdrawalsCounter;
    uint private _maxWithdrawValue;
    Withdraw[] private _proposedWithdrawals;
    Withdraw[] private _executedWithdrawals;

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

        uint _value;
        uint _dueDate;     //block.timestamp() --- from unix epoch
        uint _paymentDate;
    }

    struct Withdraw {

        uint _id;
        Member _proposer;
        Member[] _authorizations;
        uint _authorizationsCounter;
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

    modifier onlyMainAddress {
        require(_membersMap[msg.sender]._mainAddress == msg.sender, 
            'Only the main address of a member can call this function');
        _;
    }

    modifier onlySecondaryAddress (address payable mainAddress_) {
        require (checkSecondaryAddress(mainAddress_, payable(msg.sender)), 
            'Only an allowed secondary address of a member can call this function');
        _;
    }

    modifier anyMemberAddress (address payable mainAddress_) {
        require(
            _membersMap[msg.sender]._mainAddress == msg.sender
            || checkSecondaryAddress(mainAddress_, payable(msg.sender)),
                'Only the main address or an allowed secondary address of a member can call this function'
        );
        _;
    }

    modifier coinETH {
        require(_contractCoin == AllowedCoins.ETH, 
            'The contract coin must be ETH to call this function');
        _;
    }

    modifier onlyCommitte {
        require(_membersMap[msg.sender]._committeMember, 
            'Only committe members can call this function');
        _;
    }

    /* ------------------------------------  PRIVATE FUNCTIONS -------------------------------- */

    /* Add a new member to the list of members */
    function addNewMember (Member memory newMember) private {
        Member storage m = _membersMap[newMember._mainAddress];
        
        m._login = newMember._login;
        m._mainAddress = newMember._mainAddress;
        m._secondaryAddresses = newMember._secondaryAddresses;
        m._committeMember = newMember._committeMember;
        m._contractApproved = false;

        for (uint i = 0; i < newMember._payments.length; i++) {
            m._payments.push(newMember._payments[i]);
        }

        _membersList.push(m);
    }
    

    /* Checks if the secondary address is in the list of secondary addresses of the member */
    function checkSecondaryAddress (address payable mainAddress_, address payable secondaryAddress_) private view returns (bool) {
        bool allowed = false;

        for (uint i = 0; i < _membersMap[mainAddress_]._secondaryAddresses.length; i++) {
            if (_membersMap[mainAddress_]._secondaryAddresses[i] == secondaryAddress_) {
                allowed = true;
                break;
            }
        }

        return allowed;
    }


    function removeSecondaryAddress (Member storage m, address payable addressToBeRemoved_) private {
        // TODO: Implement
    }


    function getNextPendingPayment (address payable memberAddress_) internal view returns (Payment storage) {
        Payment[] storage payments = _membersMap[memberAddress_]._payments;

        uint i;

        Payment memory p;

        for (i = 0; i < payments.length; i++) {
            if (payments[i]._paymentDate == 0) {
                p = payments[i];
                break;
            }
        }

        require(p._value > 0 && p._dueDate > 0, 'This member has not pending payments anymore');

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

        //TODO: Incluir as subtrações dos withdrawals executados.
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

    function isContractApprovedByAllMembers () public view returns (bool) {
        bool approved = true;
        for (uint i = 0; i < _membersList.length; i++) {
            if (!_membersList[i]._contractApproved) {
                approved = false;
                break;
            }
        }
        return approved;
    }


    function getNextPaymentDueDate (address payable memberAddress_) public view returns (uint) {
        Payment memory nextPayment = getNextPendingPayment(memberAddress_);
        return nextPayment._dueDate;
    }


    function getRemainingDebt (address payable memberAddress_) public view returns (uint) {
        Payment[] storage p = _membersMap[memberAddress_]._payments;

        uint remainingValue = 0;

        for (uint i; i < p.length; i++) {
            if (p[i]._paymentDate == 0) {
                remainingValue += p[i]._value;
            }
        }
        return remainingValue;
    }


    function getPaidValue (address payable memberAddress_) public view returns (uint) {
        Payment[] storage p = _membersMap[memberAddress_]._payments;

        uint paidValue = 0;

        for (uint i; i < p.length; i++) {
            if (p[i]._paymentDate != 0) {
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


    /* ----------------------------- FUNCTIONS CALLED BY A SINGLE MEMBER ------------------------ */


    function approveTheContract () public onlyMainAddress {
        require(_membersMap[msg.sender]._contractApproved == false);
        _membersMap[msg.sender]._contractApproved = true;
    }


    /* Functon to add a secondary address to the list of secondary addresses of the message sender */
    function addSecondaryAddress (address payable newAddress_) public onlyMainAddress {
        _membersMap[msg.sender]._secondaryAddresses.push(newAddress_);
    }


    function changeMainAddress (address payable oldMainAddress_) public onlySecondaryAddress(oldMainAddress_) {
        _membersMap[msg.sender] = _membersMap[oldMainAddress_];
        _membersMap[msg.sender]._mainAddress = payable(msg.sender);
        removeSecondaryAddress(_membersMap[msg.sender], payable(msg.sender));

        _membersMap[oldMainAddress_] = _membersMap[address(0)]; // Pointing the old address to the member of zero address

    }


    /* --------------------------------- FINANCIAL TRANSACTIONS FUNCTIONS (ETH) ------------------------------ */

    function payNextPayment_ETH (address payable mainAddress_) public payable anyMemberAddress(mainAddress_) coinETH {
        Payment storage nextPayment = getNextPendingPayment(mainAddress_);
        require(msg.value == nextPayment._value, 'The transaction value must be equal to the payment value');
        nextPayment._paymentDate = block.timestamp;
    }
    
    function proposeWithdraw_ETH (uint value_, string memory objective_, address payable destination_) public onlyCommitte onlyMainAddress {
        
        require(value_ <= _maxWithdrawValue, 'Withdraw value must be less than the maximum defined in this contract');
        require(value_ <= getContractBalance_ETH());

        Withdraw storage newWithdraw = _proposedWithdrawals.push();

        newWithdraw._id = _withdrawalsCounter;
        newWithdraw._proposer = _membersMap[msg.sender];
        newWithdraw._value = value_;
        newWithdraw._objective = objective_;
        newWithdraw._destination = destination_;

        newWithdraw._authorizations[0] = _membersMap[msg.sender];
        newWithdraw._authorizationsCounter++;
        _withdrawalsCounter++;
    }


    function authorizeWithdraw_ETH (uint id_) public onlyCommitte onlyMainAddress {

        for (uint i = 0; i < _proposedWithdrawals.length; i++) {
            if (_proposedWithdrawals[i]._id == id_) {
                _proposedWithdrawals[i]._authorizations[_proposedWithdrawals[i]._authorizationsCounter] = _membersMap[msg.sender];
                _proposedWithdrawals[i]._authorizationsCounter++;

                if (_proposedWithdrawals[i]._authorizationsCounter >= _minCommitteMembersToWithdraw) {
                    _proposedWithdrawals[i]._authorized = true;
                }
                break;
            }
        }

    }


    function executeWithdraw_ETH (uint id_) public onlyCommitte onlyMainAddress {

        uint i;
        Withdraw storage executedWithdraw;

        for (i = 0; i < _proposedWithdrawals.length; i++) {

            if (_proposedWithdrawals[i]._id == id_ && _proposedWithdrawals[i]._authorized) {

                executedWithdraw = _proposedWithdrawals[i];
                executedWithdraw._destination.transfer(_proposedWithdrawals[i]._value);
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