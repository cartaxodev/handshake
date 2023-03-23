// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "./MultimemberContract.sol";

abstract contract BankAccount is MultimemberContract {

    //Deposits
    Deposit[] internal _depositsList;
    uint private _depositsIncremental;
    
    //Withdrawals
    Withdrawal[] internal _withdrawalsList;
    uint private _withdrawalsIncremental;


    constructor (string memory objective_,
                 Member[] memory membersList_, 
                 address[] memory memberManagers_) MultimemberContract(objective_, membersList_, memberManagers_) {

        _depositsIncremental = 0;
        _withdrawalsIncremental = 0;
    }


    //** STRUCTS **//

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
        uint _withdrawalTimestamp;
    }

    enum AllowedTokens {
        ETH,
        ERC20
    }


    //** CUSTOM MODIFIERS **//



    //** PUBLIC VIEW GETTERS **//

    function getWithdrawals () public view returns (Withdrawal[] memory) {
        return _withdrawalsList;
    }

    function getDeposits () public view returns (Deposit[] memory) {
        return _depositsList;
    }


    //** INTERNAL FUNCTIONS **//

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

    function _registerWithdrawals (address to_, uint value_, uint withdrawalTimestamp_) internal returns (uint) {
        
        Withdrawal memory withdrawal = Withdrawal({
            _id: _withdrawalsIncremental++,
            _to: to_,
            _value: value_,
            _withdrawalTimestamp: withdrawalTimestamp_
        });

        _withdrawalsList.push(withdrawal);

        return withdrawal._id;
    }


    //** ABSRTACT/VIRTUAL FUNCTIONS **//

    function _getTokenType () virtual public view returns (AllowedTokens);
    
    function _getContractBalance () virtual public view returns (uint);

    function _deposit (uint depositValue_) virtual internal;

    function _withdraw (address payable destination_, uint value_) virtual internal;

}