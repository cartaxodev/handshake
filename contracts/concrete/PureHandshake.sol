// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "./../templates/HandshakeSuperClass.sol";

contract PureHandshake is HandshakeSuperClass {

    constructor (string memory objective_,
                 Member[] memory membersList_, 
                 address[] memory memberManagers_)
                     HandshakeSuperClass (objective_, membersList_, memberManagers_) {}

    function _getTokenType()
        public
        view
        override
        returns (AllowedTokens)
    {}

    function _getContractBalance()
        public
        view
        override
        returns (uint)
    {}

    function _deposit(uint depositValue_) public payable override {}

    function _withdraw(
        address payable destination_,
        uint value_
    ) public override {}
}