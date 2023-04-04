// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

//import "hardhat/console.sol";

import "./../templates/HandshakeSuperClass_ETH.sol";
import "./../features/memberListController/MemberListController_Proxy.sol";
import "./../features/memberListController/MemberListController_Logic.sol";
import "./../features/memberListController/MemberListController_Structs.sol";
import "./../features/depositScheduler/DepositScheduler_Proxy.sol";
import "./../features/depositScheduler/DepositScheduler_Logic.sol";
import "./../features/depositScheduler/DepositScheduler_Structs.sol";
import "./../features/withdrawalController/WithdrawalController_Proxy.sol";
import "./../features/withdrawalController/WithdrawalController_Logic.sol";
import "./../features/withdrawalController/WithdrawalController_Structs.sol";

contract GraduationQuota_ETH is HandshakeSuperClass_ETH {

    //PROXIES
    MemberListController_Proxy public _memberListController;
    DepositScheduler_Proxy public _depositScheduler;
    WithdrawalController_Proxy public _withdrawalController;
    
    constructor (string memory objective_,
                Member[] memory membersList_, 
                address[] memory memberManagers_,
                uint minApprovalsToAddNewMember_,
                uint minApprovalsToRemoveMember_,
                DeadlineControlConfig memory deadlineControlConfig_,
                DepositScheduling[] memory depositSchedule_,
                address[] memory withdrawalApprovers_,
                uint minApprovalsToWithdraw_,
                uint maxWithdrawValue_
                ) HandshakeSuperClass_ETH (objective_, membersList_, memberManagers_)
                {
                    bytes memory delegateCallData_;
                    
                    /* CREATING AND INITIALIZING MEMBER LIST CONTROLLER */
                    delegateCallData_ = abi.encodeWithSelector(
                                                            MemberListController_Logic.initializeFeature.selector, 
                                                            address(this), 
                                                            minApprovalsToAddNewMember_,
                                                            minApprovalsToRemoveMember_);

                    MemberListController_Logic memberListControllerlogic_ = new MemberListController_Logic();
                    _memberListController = new MemberListController_Proxy(memberListControllerlogic_, delegateCallData_);
                    _grantFeatureRole(address(_memberListController));

                    
                    /* CREATING AND INITIALIZING DEPOSIT SCHEDULER */
                    delegateCallData_ = abi.encodeWithSelector(
                                                            DepositScheduler_Logic.initializeFeature.selector, 
                                                            address(this), 
                                                            deadlineControlConfig_,
                                                            depositSchedule_);

                    DepositScheduler_Logic depositSchedulerlogic_ = new DepositScheduler_Logic();
                    _depositScheduler = new DepositScheduler_Proxy(depositSchedulerlogic_, delegateCallData_);
                    _grantFeatureRole(address(_depositScheduler));
                    

                    /* CREATING AND INITIALIZING WITHDRAWAL CONTROLLER */
                    delegateCallData_ = abi.encodeWithSelector(
                                                            WithdrawalController_Logic.initializeFeature.selector, 
                                                            address(this), 
                                                            membersList_,
                                                            withdrawalApprovers_,
                                                            minApprovalsToWithdraw_,
                                                            maxWithdrawValue_);

                    WithdrawalController_Logic withdrawalControllerlogic_ = new WithdrawalController_Logic();
                    _withdrawalController = new WithdrawalController_Proxy(withdrawalControllerlogic_, delegateCallData_);
                    _grantFeatureRole(address(_withdrawalController));
                }
}