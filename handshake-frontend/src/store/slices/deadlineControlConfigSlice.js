import { createSlice } from "@reduxjs/toolkit";

const deadlineControlConfigSlice = createSlice({

    name: "deadlineControlConfig",
    initialState: {
        deadlineControlConfig_: {
            _isControlActive: false,
            _dailyFee: 0,
            _weeklyFee: 0,
            _monthlyFee: 0
        }
    },
    reducers: {
        
        changeDeadlineControlConfig(state, action) {
            state.deadlineControlConfig_ = action.payload;
        }
    }
});

export const { changeDeadlineControlConfig } = deadlineControlConfigSlice.actions;
export const deadlineControlConfigReducer = deadlineControlConfigSlice.reducer;