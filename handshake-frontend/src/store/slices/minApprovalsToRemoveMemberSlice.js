import { createSlice } from "@reduxjs/toolkit";

const minApprovalsToRemoveMemberSlice = createSlice({

    name: "minApprovalsToRemovewMember",
    initialState: {
        minApprovalsToRemoveMember_: 0
    },
    reducers: {
        
        changeMinApprovalsToRemoveMember(state, action) {
            state.minApprovalsToRemoveMember_ = action.payload;
        }
    }
});

export const { changeMinApprovalsToRemoveMember } = minApprovalsToRemoveMemberSlice.actions;
export const minApprovalsToRemoveMemberReducer = minApprovalsToRemoveMemberSlice.reducer;