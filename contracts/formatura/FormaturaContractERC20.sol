// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "./FormaturaBaseContract.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FormaturaContractERC20 is FormaturaBaseContract {

    AllowedTokens constant internal _tokenType = AllowedTokens.ERC20;
    address internal _tokenAddress;
    IERC20 internal _token;

    constructor (Member[] memory membersList_, 
                uint8 minCommitteMembersToWithdraw_, 
                uint maxWithdrawValue_,
                address tokenAddress_) FormaturaBaseContract (
                                                    membersList_,
                                                    minCommitteMembersToWithdraw_,
                                                    maxWithdrawValue_
                                                ) {
        _tokenAddress = tokenAddress_;
        _token = IERC20(tokenAddress_);
    }

    function getTokenType () override public pure returns (AllowedTokens) {
        return _tokenType;
    }

    function getContractBalance () override public view returns (uint) {
        return _token.balanceOf(address(this));
    }

    function checkValueAndTransfer (uint paymentValue_) override internal {
        //require(msg.value == paymentValue_, 'The transaction value must be equal to the payment value');
        require(paymentValue_ > 0, "Payment value must be greater than zero");
        uint256 allowance = _token.allowance(msg.sender, address(this));
        require(allowance >= paymentValue_, "This contract has not enough allowance to execute this payment");
        _token.transferFrom(msg.sender, address(this), paymentValue_);
    }

    function transfer(address payable destination_, uint value_) override internal {
        _token.transfer(destination_, value_);
    }


}