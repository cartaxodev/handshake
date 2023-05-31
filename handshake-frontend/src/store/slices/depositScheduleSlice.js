import { createSlice } from "@reduxjs/toolkit";

const depositScheduleSlice = createSlice({

    name: "depositSchedule",
    initialState: {
        depositSchedule_: []
    },
    reducers: {

        createDepositSchedule(state, action) {
            let schedulings = [];
            for (let i = 0; i < action.payload; i++) {
                schedulings.push({
                    _value: 0,
                    _deadlineTimestamp: 0,
                    _executionInfo: {}
                });
            }
            state.depositSchedule_ = schedulings;
        },
        
        changeDepositScheduling(state, action) {
            state.depositSchedule_[action.payload.index] = action.payload.scheduling;
        }
    }
});

export const { createDepositSchedule, changeDepositScheduling } = depositScheduleSlice.actions;
export const depositScheduleReducer = depositScheduleSlice.reducer;