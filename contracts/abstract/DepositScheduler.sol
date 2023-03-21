// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "./BankAccount.sol";

abstract contract DepositScheduler is BankAccount {

   // Deposits Schedule
   mapping (uint => DepositScheduling[]) _depositSchedule;
   bool internal _scheduleCreated;

   // Deadline and fees control
   DeadlineControlConfig internal _deadlineControlConfig;


   constructor (Member[] memory membersList_,
                address[] memory memberManagers_, 
                DeadlineControlConfig memory deadlineControlConfig_) BankAccount (membersList_, memberManagers_) {

      _deadlineControlConfig = deadlineControlConfig_;
   }

   //** STRUCTS **/

   struct DeadlineControlConfig {
      bool _isControlActive;
      uint _dailyFee;
      uint _weeklyFee;
      uint _monthlyFee;
   }

   struct DepositScheduling {
      uint _memberId;
      uint _value;
      uint _deadlineTimestamp;
      DepositExecutionInfo _executionInfo;
   }

   struct DepositExecutionInfo {
      bool _executed;
      uint _principalValue;
      uint _lateDepositFee;
      uint _finalValue;
      uint _depositId;
   }


   //** CUSTOM MODIFIERS **//

   modifier scheduleNotCreated {
      require(!_scheduleCreated, 
            'The deposit schedule has alredy been created');
      _;
   }


   //** INTERNAL METHODS **/

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

   function createDepositSchedule (DepositScheduling[] memory depositSchedule_) public scheduleNotCreated {

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


   function payNextDeposit (uint8 memberIndex_) public payable contractApprovedForAll anyMemberAddress(memberIndex_) {
      DepositScheduling storage nextDeposit = _getNextPendingDeposit(memberIndex_);
      
      if (_deadlineControlConfig._isControlActive) {
         nextDeposit._executionInfo._lateDepositFee = _getLateDepositFee(nextDeposit);
         nextDeposit._executionInfo._finalValue = (nextDeposit._executionInfo._principalValue + nextDeposit._executionInfo._lateDepositFee);
      }

      _deposit(nextDeposit._executionInfo._finalValue);
      uint depositId = _registerDeposit(msg.sender, nextDeposit._value, block.timestamp);
      nextDeposit._executionInfo._executed = true;
      nextDeposit._executionInfo._depositId = depositId;
   }

}