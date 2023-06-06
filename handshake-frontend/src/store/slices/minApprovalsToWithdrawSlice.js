import { createSlice } from "@reduxjs/toolkit";

const minApprovalsToWithdrawSlice = createSlice({

    name: "minApprovalsToWithdraw",
    initialState: {
        minApprovalsToWithdraw_: 0
    },
    reducers: {
        
        changeMinApprovalsToWithdraw(state, action) {
            state.minApprovalsToWithdraw_ = action.payload;
        }
    }
});

export const { changeMinApprovalsToWithdraw } = minApprovalsToWithdrawSlice.actions;
export const minApprovalsToWithdrawReducer = minApprovalsToWithdrawSlice.reducer;