import { configureStore } from '@reduxjs/toolkit';
import { networkReducer, changeNetwork } from './slices/baseParams/networkSlice';
import { currencyReducer, changeCurrency } from './slices/baseParams/currencySlice';
import { contractTypeReducer, changeContractType } from './slices/baseParams/contractTypeSlice';
import { objectiveReducer, changeObjective } from './slices/objectiveSlice';
import { memberListReducer, addMember, removeMember, changeMemberLogin, changeMemberMainAddress } from './slices/memberListSlice';
import { memberManagersReducer, addMemberManager, removeMemberManager } from './slices/memberManagersSlice';
import { minApprovalsToAddNewMemberReducer, changeMinApprovalsToAddNewMember } from './slices/minApprovalsToAddNewMemberSlice';
import { minApprovalsToRemoveMemberReducer, changeMinApprovalsToRemoveMember } from './slices/minApprovalsToRemoveMemberSlice';
import { minApprovalsToWithdrawReducer, changeMinApprovalsToWithdraw } from './slices/minApprovalsToWithdrawSlice';
import { withdrawalApproversReducer, addWithdrawalApprover, removeWithdrawalApprover } from './slices/withdrawalApproversSlice';
import { maxWithdrawValueReducer, changeMaxWithdrawValue } from './slices/maxWithdrawValueSlice';
import { deadlineControlConfigReducer, changeDeadlineControlConfig } from './slices/deadlineControlConfigSlice';
import { depositScheduleReducer, createDepositSchedule, changeDepositScheduling } from './slices/depositScheduleSlice';

const store = configureStore({
    reducer: {
        network: networkReducer,
        currency: currencyReducer,
        contractType: contractTypeReducer,
        objective: objectiveReducer,
        memberList: memberListReducer,
        memberManagers: memberManagersReducer,
        minApprovalsToAddNewMember: minApprovalsToAddNewMemberReducer,
        minApprovalsToRemoveMember: minApprovalsToRemoveMemberReducer,
        minApprovalsToWithdraw: minApprovalsToWithdrawReducer,
        withdrawalApprovers: withdrawalApproversReducer,
        maxWithdrawValue: maxWithdrawValueReducer,
        deadlineControlConfig: deadlineControlConfigReducer,
        depositSchedule: depositScheduleReducer
    }
});

export {
    store,
    changeObjective,
    addMember,
    removeMember,
    changeMemberLogin,
    changeMemberMainAddress,
    addMemberManager,
    removeMemberManager,
    changeMinApprovalsToAddNewMember,
    changeMinApprovalsToRemoveMember,
    changeMinApprovalsToWithdraw,
    addWithdrawalApprover,
    removeWithdrawalApprover,
    changeMaxWithdrawValue,
    changeDeadlineControlConfig,
    createDepositSchedule,
    changeDepositScheduling,
    changeNetwork,
    changeCurrency,
    changeContractType
};