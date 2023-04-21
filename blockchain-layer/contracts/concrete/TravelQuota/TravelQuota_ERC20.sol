// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

//import "hardhat/console.sol";

import "./../../templates/HandshakeSuperClass_ERC20.sol";
import "./../../features/memberListController/MemberListController_Proxy.sol";
import "./../../features/memberListController/MemberListController_Logic.sol";
import "./../../features/memberListController/MemberListController_Structs.sol";
import "./../../features/depositScheduler/DepositScheduler_Proxy.sol";
import "./../../features/depositScheduler/DepositScheduler_Logic.sol";
import "./../../features/depositScheduler/DepositScheduler_Structs.sol";
import "./../../features/withdrawalController/WithdrawalController_Proxy.sol";
import "./../../features/withdrawalController/WithdrawalController_Logic.sol";
import "./../../features/withdrawalController/WithdrawalController_Structs.sol";

contract TravelQuota_ERC20 is HandshakeSuperClass_ERC20 {

    //PROXIES
    MemberListController_Proxy public _memberListController;
    DepositScheduler_Proxy public _depositScheduler;
    WithdrawalController_Proxy public _withdrawalController;
    
    constructor (string memory objective_,
                Member[] memory membersList_, 
                address[] memory memberManagers_,
                address tokenAddress_,
                uint minApprovalsToAddNewMember_,
                uint minApprovalsToRemoveMember_,
                DeadlineControlConfig memory deadlineControlConfig_,
                DepositScheduling[] memory depositSchedule_,
                address[] memory withdrawalApprovers_,
                uint minApprovalsToWithdraw_,
                uint maxWithdrawValue_
                ) HandshakeSuperClass_ERC20 (objective_, membersList_, tokenAddress_)
                {
                    bytes memory delegateCallData_;
                    
                    /* CREATING AND INITIALIZING MEMBER LIST CONTROLLER */
                    delegateCallData_ = abi.encodeWithSelector(
                                                            MemberListController_Logic.initializeFeature.selector, 
                                                            address(this),
                                                            membersList_,
                                                            memberManagers_,
                                                            minApprovalsToAddNewMember_,
                                                            minApprovalsToRemoveMember_);

                    MemberListController_Logic memberListControllerlogic_ = new MemberListController_Logic();
                    _memberListController = new MemberListController_Proxy(memberListControllerlogic_, delegateCallData_);
                    _grantFeatureRole(address(_memberListController));
                    for (uint i = 0; i < memberManagers_.length; i++) {
                        _grantRole(MEMBER_MANAGER_ROLE, memberManagers_[i]);
                    }

                    
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
                    for (uint i = 0; i < withdrawalApprovers_.length; i++) {
                        _grantRole(WITHDRAWAL_APPROVER_ROLE, withdrawalApprovers_[i]);
                    }
                }
}