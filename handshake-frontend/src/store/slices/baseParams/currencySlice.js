import { createSlice } from "@reduxjs/toolkit";

const currencySlice = createSlice({

    name: "currency",
    initialState: {
        currency: 1
    },
    reducers: {
        
        changeCurrency(state, action) {
            state.currency = action.payload;
        }
    }
});

export const { changeCurrency } = currencySlice.actions;
export const currencyReducer = currencySlice.reducer;