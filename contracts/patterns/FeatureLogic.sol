// SPDX-License-Identifier: UNLICENSED

import "./../util/AccessControlUtils.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./../templates/HandshakeSuperClass.sol";

pragma solidity ^0.8.17;

abstract contract FeatureLogic is Initializable, AccessControlUtils {

    HandshakeSuperClass internal _concreteContract;

    function _initializeLogic (address concreteContractAddress_) internal {
        _concreteContract = HandshakeSuperClass(concreteContractAddress_);
    }

    modifier onlyMainAddress (uint memberId_) {
        require (_concreteContract.__checkMainAddress(memberId_, msg.sender), 
                        "Only the main address of an active member can call this function");
        _;
    }

     modifier onlySecondaryAddress (uint memberId_) {
        require (_concreteContract.__checkSecondaryAddress(memberId_, msg.sender), 
            'Only an allowed secondary address of an active member can call this function');
        _;
    }

    modifier onlyApproved {
        require(_concreteContract.isContractApproved(), "This contract is not aproved by all active members");
        _;
    }

    modifier onlyRole(bytes32 role_) {
        require (_concreteContract.hasRole(role_, msg.sender), "This address has not a needed role");
        _;
    }

    modifier onlyConcrete {
        require (msg.sender == address(_concreteContract), "Only the concrete contract can call this function");
        _;
    }

}