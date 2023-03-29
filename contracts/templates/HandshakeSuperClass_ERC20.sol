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
                 address[] memory memberManagers_,
                 address tokenAddress_) HandshakeSuperClass (objective_, membersList_, memberManagers_) {
                    
        _tokenAddress = tokenAddress_;
        _token = IERC20(tokenAddress_);
    }

    function _getTokenType () override public pure returns (AllowedTokens) {
        return _tokenType;
    }

    function _getContractBalance () override public view returns (uint) {
        return _token.balanceOf(address(this));
    }

    function _deposit (uint depositValue_) override public payable onlyInternalFeature {
        //require(msg.value == paymentValue_, 'The transaction value must be equal to the payment value');
        require(depositValue_ > 0, "Deposit value must be greater than zero");
        uint256 allowance = _token.allowance(msg.sender, address(this));
        require(allowance >= depositValue_, "This contract has not enough allowance to execute this deposit");
        _token.transferFrom(msg.sender, address(this), depositValue_);
    }

    function _withdraw(address payable destination_, uint value_) override public onlyInternalFeature {
        _token.transfer(destination_, value_);
    }


}