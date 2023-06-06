import { createSlice } from "@reduxjs/toolkit";

const networkSlice = createSlice({

    name: "network",
    initialState: {
        network: 1
    },
    reducers: {
        
        changeNetwork(state, action) {
            state.network = action.payload;
        }
    }
});

export const { changeNetwork } = networkSlice.actions;
export const networkReducer = networkSlice.reducer;