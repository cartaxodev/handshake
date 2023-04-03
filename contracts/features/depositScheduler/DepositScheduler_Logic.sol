// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "./DepositScheduler_Structs.sol";
import "./../../patterns/FeatureLogic.sol";

contract DepositScheduler_Logic is FeatureLogic {

   // Deposits Schedule
   mapping (uint => DepositScheduling[]) private _depositSchedule; // memberId --> Schedule
   bool private _scheduleCreated;

   // Deadline and fees control
   DeadlineControlConfig private _deadlineControlConfig;


   /* CONTRACT INITIALIZATION FUNCTON 
        IT MUST BE CALLED BY THE PROXY CONTRACT CONSTRUCTOR */
   function initializeFeature (address concreteContractAddress_,
                                    DeadlineControlConfig memory deadlineControlConfig_,
                                    DepositScheduling[] memory depositSchedule_
                                    ) external initializer {
      
      _initializeLogic(concreteContractAddress_);
      _deadlineControlConfig = deadlineControlConfig_;
      _createDepositSchedule(depositSchedule_);
   }

   /* PUBLIC VIEW FUNCTIONS */

   function getMemberSchedule (uint memberId_) public view returns (DepositScheduling[] memory) {
      return _depositSchedule[memberId_];
   }


   //** INTERNAL METHODS **/

   function _createDepositSchedule (DepositScheduling[] memory depositSchedule_) private {

      for (uint i = 0; i < depositSchedule_.length; i++) {
         DepositScheduling memory newScheduling = depositSchedule_[i];
         newScheduling._executionInfo = DepositExecutionInfo({
            _executed: false,
            _principalValue: newScheduling._value,
            _lateDepositFee: 0,
            _finalValue: newScheduling._value,
            _depositId: 0
         });

         DepositScheduling[] storage memberSchedule = _depositSchedule[newScheduling._memberId];
         memberSchedule.push(newScheduling);
      }

      _scheduleCreated = true;
   }

   function _getNextPendingDeposit (uint8 memberId_) private view returns (DepositScheduling storage) {
        
      DepositScheduling[] storage memberSchedule = _depositSchedule[memberId_];
      DepositScheduling storage pendingDeposit = memberSchedule[0];
      bool havePendingDeposits = false;

      for (uint i = 0; i < memberSchedule.length; i++) {
         
         if (memberSchedule[i]._executionInfo._executed == false) {
 
            pendingDeposit = memberSchedule[i];
            havePendingDeposits = true;
            break;
         }
      }

      require (havePendingDeposits, 'This member has not pending deposits anymore' );
      return pendingDeposit;
   }

   function _getLateDepositFee(DepositScheduling memory depositScheduling_) internal pure returns (uint) {
      //TODO: Implement
      return 0;
   }


   //** PUBLIC API **//

   function getNextPendingDeposit (uint8 memberId_) public view returns (DepositScheduling memory) {
      return _getNextPendingDeposit(memberId_);
   }

   function payNextDeposit (uint8 memberId_) public payable contractApprovedForAll onlyMainAddress(memberId_) {
      DepositScheduling storage nextDeposit = _getNextPendingDeposit(memberId_);
      
      if (_deadlineControlConfig._isControlActive) {
         nextDeposit._executionInfo._lateDepositFee = _getLateDepositFee(nextDeposit);
         nextDeposit._executionInfo._finalValue = (nextDeposit._executionInfo._principalValue + nextDeposit._executionInfo._lateDepositFee);
      }

      _concreteContract._deposit(nextDeposit._executionInfo._finalValue);
      uint depositId = _concreteContract._registerDeposit(msg.sender, nextDeposit._value, block.timestamp);
      nextDeposit._executionInfo._executed = true;
      nextDeposit._executionInfo._depositId = depositId;
   }

}