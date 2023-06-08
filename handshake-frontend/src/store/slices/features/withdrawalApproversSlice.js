import { createSlice } from "@reduxjs/toolkit";
import { removeMember } from "./memberListSlice";
import { resetFeatureSlices } from "../mainSlice";

const initialState = {
    withdrawalApprovers_: []
};

const withdrawalApproversSlice = createSlice({

    name: "withdrawalApprovers",
    initialState: initialState,
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
        });

        builder.addCase(resetFeatureSlices, (state, action) => {
            state.withdrawalApprovers_ = initialState.withdrawalApprovers_;
        });
    }
});

export const { addWithdrawalApprover, removeWithdrawalApprover } = withdrawalApproversSlice.actions;
export const withdrawalApproversReducer = withdrawalApproversSlice.reducer;