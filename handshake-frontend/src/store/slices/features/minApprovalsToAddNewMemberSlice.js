import { createSlice } from "@reduxjs/toolkit";
import { resetFeatureSlices } from "../mainSlice";

const initialState = {
    minApprovalsToAddNewMember_: 0
};

const minApprovalsToAddNewMemberSlice = createSlice({

    name: "minApprovalsToAddNewMember",
    initialState: initialState,
    reducers: {
        
        changeMinApprovalsToAddNewMember(state, action) {
            state.minApprovalsToAddNewMember_ = action.payload;
        }
    },
    extraReducers(builder) {
        builder.addCase(resetFeatureSlices, (state, action) => {
            state.minApprovalsToAddNewMember_ = initialState.minApprovalsToAddNewMember_;
        });
    }
});

export const { changeMinApprovalsToAddNewMember } = minApprovalsToAddNewMemberSlice.actions;
export const minApprovalsToAddNewMemberReducer = minApprovalsToAddNewMemberSlice.reducer;