import { configureStore } from '@reduxjs/toolkit';

//Main Slice
import { mainReducer, resetFeatureSlices } from './slices/mainSlice';

//Base Params Slices
import { networkReducer, changeNetwork } from './slices/baseParams/networkSlice';
import { currencyReducer, changeCurrency } from './slices/baseParams/currencySlice';
import { contractTypeReducer, changeContractType } from './slices/baseParams/contractTypeSlice';

//Features Slices
import { objectiveReducer, changeObjective } from './slices/features/objectiveSlice';
import { memberListReducer, addMember, removeMember, changeMemberLogin, changeMemberMainAddress } from './slices/features/memberListSlice';
import { memberManagersReducer, addMemberManager, removeMemberManager } from './slices/features/memberManagersSlice';
import { minApprovalsToAddNewMemberReducer, changeMinApprovalsToAddNewMember } from './slices/features/minApprovalsToAddNewMemberSlice';
import { minApprovalsToRemoveMemberReducer, changeMinApprovalsToRemoveMember } from './slices/features/minApprovalsToRemoveMemberSlice';
import { minApprovalsToWithdrawReducer, changeMinApprovalsToWithdraw } from './slices/features/minApprovalsToWithdrawSlice';
import { withdrawalApproversReducer, addWithdrawalApprover, removeWithdrawalApprover } from './slices/features/withdrawalApproversSlice';
import { maxWithdrawValueReducer, changeMaxWithdrawValue } from './slices/features/maxWithdrawValueSlice';
import { deadlineControlConfigReducer, changeDeadlineControlConfig } from './slices/features/deadlineControlConfigSlice';
import { depositScheduleReducer, createDepositSchedule, changeDepositScheduling } from './slices/features/depositScheduleSlice';

const store = configureStore({
    reducer: {
        main: mainReducer,
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
    resetFeatureSlices,
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