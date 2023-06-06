import { createSlice } from "@reduxjs/toolkit";

let memberIdCounter = 0;

const memberListSlice = createSlice({

    name: "memberList",
    initialState: {
        memberList_: []
    },
    reducers: {

        addMember(state, action) {
            state.memberList_.push({
                ...action.payload,
                _id: memberIdCounter++
            });
        },

        removeMember(state, action) {
            state.memberList_ = state.memberList_.filter((member, index) => {
                return member._id !== action.payload;
            });
        },

        changeMemberLogin(state, action) {
            for (let m of state.memberList_) {
                if (m._id === action.payload._id) {
                    m._login = action.payload._login;
                }
            }
        },

        changeMemberMainAddress(state, action) {
            for (let m of state.memberList_) {
                if (m._id === action.payload._id) {
                    m._mainAddress = action.payload._mainAddress;
                }
            }
        }
    }
});

export const { addMember, removeMember, changeMemberLogin, changeMemberMainAddress } = memberListSlice.actions;
export const memberListReducer = memberListSlice.reducer;