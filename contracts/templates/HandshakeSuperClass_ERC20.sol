// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "./HandshakeSuperClass.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

abstract contract HandshakeSuperClass_ERC20 is HandshakeSuperClass {

    AllowedTokens constant internal _tokenType = AllowedTokens.ERC20;
    address internal _tokenAddress;
    IERC20 internal _token;

    constructor(string memory objective_,
                 Member[] memory membersList_,
                 address tokenAddress_) HandshakeSuperClass (objective_, membersList_) {
                    
        _tokenAddress = tokenAddress_;
        _token = IERC20(tokenAddress_);
    }

    function getTokenType () override public pure returns (AllowedTokens) {
        return _tokenType;
    }

    function getContractBalance () override public view returns (uint) {
        return _token.balanceOf(address(this));
    }

    function __deposit (address payable from_, uint value_) override public payable onlyInternalFeature returns (uint) {
        //require(msg.value == paymentValue_, 'The transaction value must be equal to the payment value');
        require(value_ > 0, "Deposit value must be greater than zero");
        uint allowance = _token.allowance(from_, address(this));
        require(allowance >= value_, "This contract has not enough allowance to execute this deposit");
        _token.transferFrom(from_, address(this), value_);
        return _registerDeposit(from_, value_, block.timestamp);

    }

    function __withdraw(address payable to_, uint value_) override public onlyInternalFeature returns (uint) {
        _token.transfer(to_, value_);
        return _registerWithdrawal(to_, value_, block.timestamp);
    }

    function getTokenAddress() public view returns (address) {
        return _tokenAddress;
    }


}