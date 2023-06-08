import { createSlice } from "@reduxjs/toolkit";
import { resetFeatureSlices } from "../mainSlice";

const initialState = {
    minApprovalsToRemoveMember_: 0
};

const minApprovalsToRemoveMemberSlice = createSlice({

    name: "minApprovalsToRemovewMember",
    initialState: initialState,
    reducers: {
        
        changeMinApprovalsToRemoveMember(state, action) {
            state.minApprovalsToRemoveMember_ = action.payload;
        }
    },
    extraReducers(builder) {
        builder.addCase(resetFeatureSlices, (state, action) => {
            state.minApprovalsToRemoveMember_ = initialState.minApprovalsToRemoveMember_;
        });
    }
});

export const { changeMinApprovalsToRemoveMember } = minApprovalsToRemoveMemberSlice.actions;
export const minApprovalsToRemoveMemberReducer = minApprovalsToRemoveMemberSlice.reducer;