// SPDX-License-Identifier: UNLICENSED

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "./../util/AccessControlUtils.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./../templates/HandshakeSuperClass.sol";

pragma solidity ^0.8.17;

abstract contract FeatureLogic is Initializable, AccessControlEnumerable, AccessControlUtils {

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

    modifier contractApprovedForAll {
        require(_concreteContract.isContractApproved(), "This contract is not aproved by all active members");
        _;
    }

}