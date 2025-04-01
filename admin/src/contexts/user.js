import { createSlice } from "@reduxjs/toolkit";

const user = createSlice({
    name: "user",
    initialState: {
        _id: '',
        name: '',
        username: '',
        role: ''
    },
    reducers: {
        updateUser: (state, { payload }) => {
            return { ...state, ...payload }
        },
        cluearUser: (state) => {
            state._id = '';
            state.name = '';
            state.username = '';
            state.role = ''
        }
    }
});

export const { updateUser, cluearUser } = user.actions;
export default user.reducer;