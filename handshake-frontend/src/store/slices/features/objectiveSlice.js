import { createSlice } from "@reduxjs/toolkit";
import { resetFeatureSlices } from "../mainSlice";

const initialState = {
    objective_: ""
};

const objectiveSlice = createSlice({

    name: "objective",
    initialState: initialState,
    reducers: {
        
        changeObjective(state, action) {
            state.objective_ = action.payload;
        }
    },
    extraReducers(builder) {
        builder.addCase(resetFeatureSlices, (state, action) => {
            state.objective_ = initialState.objective_;
        })
    }
});

export const { changeObjective } = objectiveSlice.actions;
export const objectiveReducer = objectiveSlice.reducer;