import { createSlice } from "@reduxjs/toolkit";
import { removeMember } from "./memberListSlice";

const withdrawalApproversSlice = createSlice({

    name: "withdrawalApprovers",
    initialState: {
        withdrawalApprovers_: []
    },
    reducers: {

        addWithdrawalApprover(state, action) {
            state.withdrawalApprovers_.push(action.payload);
        },

        removeWithdrawalApprover(state, action) {
            state.withdrawalApprovers_ = state.withdrawalApprovers_.filter((withdrawalApprover, index) => {
                return withdrawalApprover !== action.payload;
            });
        }
    },
    extraReducers(builder) {
        builder.addCase(removeMember, (state, action) => {
            state.withdrawalApprovers_ = state.withdrawalApprovers_.filter((withdrawalApprover, index) => {
                return withdrawalApprover !== action.payload;
            });
        })
    }
});

export const { addWithdrawalApprover, removeWithdrawalApprover } = withdrawalApproversSlice.actions;
export const withdrawalApproversReducer = withdrawalApproversSlice.reducer;