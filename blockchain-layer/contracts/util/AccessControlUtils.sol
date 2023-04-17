// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

abstract contract AccessControlUtils {

    bytes32[] private _rolesList;

    //Allows external contracts to call functions
    bytes32 public constant FACADE_ROLE = keccak256("FACADE");
    bytes32 public constant INTERNAL_FEATURE_ROLE = keccak256("INTERNAL_FEATURE");

    // Allows msgSender to call functions
    bytes32 public constant MEMBER_MANAGER_ROLE = keccak256("MEMBER_MANAGER");
    bytes32 public constant WITHDRAWAL_APPROVER_ROLE = keccak256("WITHDRAWAL_APPROVER");

    constructor () {
        
        _rolesList.push(FACADE_ROLE);
        _rolesList.push(INTERNAL_FEATURE_ROLE);
        _rolesList.push(MEMBER_MANAGER_ROLE);
        _rolesList.push(WITHDRAWAL_APPROVER_ROLE);
    }

    function _getAllRoles() internal view returns (bytes32[] memory) {
        return _rolesList;
    }

} 