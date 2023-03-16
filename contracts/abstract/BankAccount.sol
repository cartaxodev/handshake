// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "./MultimemberContract.sol";

abstract contract BankAccount is MultimemberContract {

    //Deposits
    Deposit[] internal _depositsList;
    uint internal _depositsCounter;
    
    //Withdrawals
    Withdrawal[] internal _withdrawalsList;
    uint internal _withdrawalsCounter;


    constructor (Member[] memory membersList_) MultimemberContract(membersList_) {
        _depositsCounter = 0;
        _withdrawalsCounter = 0;
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
        uint _withdrawTimestamp;
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


    //** ABSRTACT/VIRTUAL FUNCTIONS **//

    function getTokenType () virtual public view returns (AllowedTokens);
    
    function getContractBalance () virtual public view returns (uint);

    function deposit (uint depositValue_) virtual internal;

    function withdraw (address payable destination_, uint value_) virtual internal;

}