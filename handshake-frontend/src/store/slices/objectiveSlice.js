import { createSlice } from "@reduxjs/toolkit";

const objectiveSlice = createSlice({

    name: "objective",
    initialState: {
        objective_: ""
    },
    reducers: {
        
        changeObjective(state, action) {
            state.objective_ = action.payload;
        }
    }
});

export const { changeObjective } = objectiveSlice.actions;
export const objectiveReducer = objectiveSlice.reducer;