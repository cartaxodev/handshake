import { createSlice } from "@reduxjs/toolkit";
import { resetFeatureSlices } from "../mainSlice";

const initialState = {
    deadlineControlConfig_: {
        _isControlActive: false,
        _dailyFee: 0,
        _weeklyFee: 0,
        _monthlyFee: 0
    }
};

const deadlineControlConfigSlice = createSlice({

    name: "deadlineControlConfig",
    initialState: initialState,
    reducers: {
        
        changeDeadlineControlConfig(state, action) {
            state.deadlineControlConfig_ = action.payload;
        }
    },
    extraReducers(builder) {
        builder.addCase(resetFeatureSlices, (state, action) => {
            state.deadlineControlConfig_ = initialState.deadlineControlConfig_;
        })
    }
});

export const { changeDeadlineControlConfig } = deadlineControlConfigSlice.actions;
export const deadlineControlConfigReducer = deadlineControlConfigSlice.reducer;