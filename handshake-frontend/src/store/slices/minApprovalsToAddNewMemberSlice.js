import { createSlice } from "@reduxjs/toolkit";

const minApprovalsToAddNewMemberSlice = createSlice({

    name: "minApprovalsToAddNewMember",
    initialState: {
        minApprovalsToAddNewMember_: 0
    },
    reducers: {
        
        changeMinApprovalsToAddNewMember(state, action) {
            state.minApprovalsToAddNewMember_ = action.payload;
        }
    }
});

export const { changeMinApprovalsToAddNewMember } = minApprovalsToAddNewMemberSlice.actions;
export const minApprovalsToAddNewMemberReducer = minApprovalsToAddNewMemberSlice.reducer;