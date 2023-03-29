// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

//import "hardhat/console.sol";

import "./../templates/HandshakeSuperClass_ETH.sol";
//, BankAccount, DepositScheduler, WithdrawalController, BankAccount_ETH 

contract GraduationQuota_ETH is HandshakeSuperClass_ETH
{

    constructor (string memory objective_,
                Member[] memory membersList_, 
                address[] memory memberManagers_ /*,
                DeadlineControlConfig memory deadlineControlConfig_,
                address[] memory withdrawalApprovers_,
                uint minApprovalsToWithdraw_,
                uint maxWithdrawValue_*/
                ) HandshakeSuperClass_ETH (objective_, membersList_, memberManagers_)
                {
                    
                    // _initMultimemberContract(objective_, membersList_, memberManagers_);
                    // _initBankAccount();
                    // _initDepositScheduler(deadlineControlConfig_);
                    // _initWithdrawalController(membersList_, withdrawalApprovers_, minApprovalsToWithdraw_, maxWithdrawValue_);
                    // _initBankAccount_ETH();

                }
}