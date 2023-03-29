// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "./DepositScheduler_Structs.sol";
import "./../../patterns/FeatureLogic.sol";

contract DepositScheduler_Logic is FeatureLogic {

   // Deposits Schedule
   mapping (uint => DepositScheduling[]) private _depositSchedule;
   bool private _scheduleCreated;

   // Deadline and fees control
   DeadlineControlConfig private _deadlineControlConfig;


   /* CONTRACT INITIALIZATION FUNCTON 
        IT MUST BE CALLED BY THE PROXY CONTRACT CONSTRUCTOR */
   function initializeFeature (HandshakeSuperClass concreteContract_,
                                    DeadlineControlConfig memory deadlineControlConfig_,
                                    DepositScheduling[] memory depositSchedule_
                                    ) external initializer {
      
      _initializeLogic(concreteContract_);
      _deadlineControlConfig = deadlineControlConfig_;
      _createDepositSchedule(depositSchedule_);
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

   function _getNextPendingDeposit (uint8 memberIndex_) internal view returns (DepositScheduling storage) {
        
      DepositScheduling[] storage memberSchedule = _depositSchedule[memberIndex_];
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
   }


   //** PUBLIC API **//

   function payNextDeposit (uint8 memberIndex_) public payable contractApprovedForAll anyMemberAddress(memberIndex_) {
      DepositScheduling storage nextDeposit = _getNextPendingDeposit(memberIndex_);
      
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