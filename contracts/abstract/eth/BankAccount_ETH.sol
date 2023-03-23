// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "./../BankAccount.sol";

abstract contract BankAccount_ETH is BankAccount {

    AllowedTokens internal constant _tokenType = AllowedTokens.ETH;

    constructor (string memory objective_,
                Member[] memory membersList_, 
                address[] memory memberManagers_) BankAccount (
                                                    objective_,
                                                    membersList_,
                                                    memberManagers_
                                                ) {
    }

    function _getTokenType () override public pure returns (AllowedTokens) {
        return _tokenType;
    }

    function _getContractBalance () override public view returns (uint) {
        return address(this).balance;
    }

    function _deposit (uint depositValue_) override internal {
        require(msg.value == depositValue_, 'The transaction value must be equal to the deposit value');
    }

    function _withdraw(address payable destination_, uint value_) override internal {
        destination_.transfer(value_);
    }


}