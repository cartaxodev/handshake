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
        // Member[] memory activeMembers = _concreteContract.getActiveMembers();
        // Member memory selectedMember;
        // for (uint i = 0; i < activeMembers.length; i++) {
        //     if (activeMembers[i]._id == memberId_) {
        //         selectedMember = activeMembers[i];
        //         break;
        //     }
        // }
        // require (selectedMember._mainAddress == msg.sender, "Only the main address of an active member can call this function");
        require (_concreteContract._checkMainAddress(memberId_, msg.sender), 
                        "Only the main address of an active member can call this function");
        _;
    }

     modifier onlySecondaryAddress (uint memberId_) {
        require (_concreteContract._checkSecondaryAddress(memberId_, msg.sender), 
            'Only an allowed secondary address of an active member can call this function');
        _;
    }

    modifier contractApprovedForAll {
        require(_concreteContract.isContractApproved(), "This contract is not aproved by all active members");
        _;
    }

}