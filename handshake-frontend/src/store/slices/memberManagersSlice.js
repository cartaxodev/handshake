import { createSlice } from "@reduxjs/toolkit";
import { removeMember } from "./memberListSlice";

const memberManagersSlice = createSlice({

    name: "memberManagers",
    initialState: {
        memberManagers_: []
    },
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
        })
    }
});

export const { addMemberManager, removeMemberManager } = memberManagersSlice.actions;
export const memberManagersReducer = memberManagersSlice.reducer;