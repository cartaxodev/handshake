import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    state: ""
};

const mainSlice = createSlice({

    name: "main",
    initialState: initialState,
    reducers: {
        
        resetFeatureSlices(state, action) {
            state.state = initialState;
        }
    }
});

export const { resetFeatureSlices } = mainSlice.actions;
export const mainReducer = mainSlice.reducer;