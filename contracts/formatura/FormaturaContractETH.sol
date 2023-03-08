// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "./FormaturaBaseContract.sol";

contract FormaturaContractETH is FormaturaBaseContract {

    constructor (Member[] memory membersList_, 
                uint8 minCommitteMembersToWithdraw_, 
                uint maxWithdrawValue_) FormaturaBaseContract (
                                                    membersList_,
                                                    minCommitteMembersToWithdraw_,
                                                    maxWithdrawValue_,
                                                    AllowedCoins.ETH
                                                ) {
    }

    

    function getContractBalance () override public view returns (uint) {
        return address(this).balance;
    }

    function checkValueAndTransfer (uint paymentValue_) override internal {
        require(msg.value == paymentValue_, 'The transaction value must be equal to the payment value');
    }

    function transfer(address payable destination_, uint value_) override internal {
        destination_.transfer(value_);
    }


}