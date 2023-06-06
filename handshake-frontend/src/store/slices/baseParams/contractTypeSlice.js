import { createSlice } from "@reduxjs/toolkit";

const contractTypeSlice = createSlice({

    name: "contractType",
    initialState: {
        contractType: 0
    },
    reducers: {
        
        changeContractType(state, action) {
            state.contractType = action.payload;
        }
    }
});

export const { changeContractType } = contractTypeSlice.actions;
export const contractTypeReducer = contractTypeSlice.reducer;