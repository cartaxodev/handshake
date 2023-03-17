// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

abstract contract AccessControlUtils {

    bytes32[] private _rolesList;

    // Allow a user to make changes in members list of a multimember contract
    bytes32 public constant MEMBER_MANAGER_ROLE = keccak256("MEMBER_MANAGER");

    constructor () {

        _rolesList.push(MEMBER_MANAGER_ROLE);

    }

    function _getAllRoles() internal view returns (bytes32[] memory) {
        return _rolesList;
    }

} 