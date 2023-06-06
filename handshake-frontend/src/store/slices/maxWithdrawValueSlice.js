import { createSlice } from "@reduxjs/toolkit";

const maxWithdrawValueSlice = createSlice({

    name: "maxWithdrawValue",
    initialState: {
        maxWithdrawValue_: 0
    },
    reducers: {
        
        changeMaxWithdrawValue(state, action) {
            state.maxWithdrawValue_ = action.payload;
        }
    }
});

export const { changeMaxWithdrawValue } = maxWithdrawValueSlice.actions;
export const maxWithdrawValueReducer = maxWithdrawValueSlice.reducer;