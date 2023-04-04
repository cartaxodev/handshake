// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "./../templates/HandshakeSuperClass.sol";

contract PureHandshake is HandshakeSuperClass {

    constructor (string memory objective_,
                 Member[] memory membersList_, 
                 address[] memory memberManagers_)
                     HandshakeSuperClass (objective_, membersList_, memberManagers_) {}

    function getTokenType()
        public
        view
        override
        returns (AllowedTokens)
    {}

    function getContractBalance()
        public
        view
        override
        returns (uint)
    {}

    function __deposit(address payable from_, uint value_) public payable override onlyInternalFeature returns (uint) {}

    function __withdraw(
        address payable to_,
        uint value_
    ) public override onlyInternalFeature returns (uint) {}
}