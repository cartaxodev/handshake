import { createSlice } from "@reduxjs/toolkit";
import { resetFeatureSlices } from "../mainSlice";

const initialState = {
    maxWithdrawValue_: 0
};

const maxWithdrawValueSlice = createSlice({

    name: "maxWithdrawValue",
    initialState: initialState,
    reducers: {
        
        changeMaxWithdrawValue(state, action) {
            state.maxWithdrawValue_ = action.payload;
        }
    },
    extraReducers(builder) {
        builder.addCase(resetFeatureSlices, (state, action) => {
            state.maxWithdrawValue_ = initialState.maxWithdrawValue_;
        })
    }
});

export const { changeMaxWithdrawValue } = maxWithdrawValueSlice.actions;
export const maxWithdrawValueReducer = maxWithdrawValueSlice.reducer;