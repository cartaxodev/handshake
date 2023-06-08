import { createSlice } from "@reduxjs/toolkit";
import { resetFeatureSlices } from "../mainSlice";

const initialState = {
    minApprovalsToWithdraw_: 0
};

const minApprovalsToWithdrawSlice = createSlice({

    name: "minApprovalsToWithdraw",
    initialState: initialState,
    reducers: {
        
        changeMinApprovalsToWithdraw(state, action) {
            state.minApprovalsToWithdraw_ = action.payload;
        }
    },
    extraReducers(builder) {
        builder.addCase(resetFeatureSlices, (state, action) => {
            state.minApprovalsToWithdraw_ = initialState.minApprovalsToWithdraw_;
        });
    }
});

export const { changeMinApprovalsToWithdraw } = minApprovalsToWithdrawSlice.actions;
export const minApprovalsToWithdrawReducer = minApprovalsToWithdrawSlice.reducer;