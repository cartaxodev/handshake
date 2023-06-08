import { createSlice } from "@reduxjs/toolkit";
import { removeMember } from "./memberListSlice";
import { resetFeatureSlices } from "../mainSlice";

const initialState = {
    memberManagers_: []
};

const memberManagersSlice = createSlice({

    name: "memberManagers",
    initialState: initialState,
    reducers: {

        addMemberManager(state, action) {
            state.memberManagers_.push(action.payload);
        },

        removeMemberManager(state, action) {
            state.memberManagers_ = state.memberManagers_.filter((memberManager, index) => {
                return memberManager !== action.payload;
            });
        }
    },
    extraReducers(builder) {

        builder.addCase(removeMember, (state, action) => {
            state.memberManagers_ = state.memberManagers_.filter((memberManager, index) => {
                return memberManager !== action.payload;
            });
        });
        
        builder.addCase(resetFeatureSlices, (state, action) => {
            state.memberManagers_ = initialState.memberManagers_;
        });
    }
});

export const { addMemberManager, removeMemberManager } = memberManagersSlice.actions;
export const memberManagersReducer = memberManagersSlice.reducer;