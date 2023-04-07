// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "./HandshakeSuperClass.sol";

abstract contract HandshakeSuperClass_ETH is HandshakeSuperClass {

    AllowedTokens internal constant _tokenType = AllowedTokens.ETH;

    constructor(string memory objective_,
                 Member[] memory membersList_) HandshakeSuperClass (objective_, membersList_) {
    }

    function getTokenType () override public pure returns (AllowedTokens) {
        return _tokenType;
    }

    function getContractBalance () override public view returns (uint) {
        return address(this).balance;
    }

    function __deposit (address payable from_, uint value_) override public payable onlyInternalFeature returns (uint) {
        require(msg.value == value_, 'The transaction value must be equal to the deposit value');
        return _registerDeposit(from_, value_, block.timestamp);
    }

    function __withdraw(address payable to_, uint value_) override public onlyInternalFeature returns (uint) {
        to_.transfer(value_);
        return _registerWithdrawal(to_, value_, block.timestamp);
    }


}