import { createSlice } from "@reduxjs/toolkit";

const cfg = createSlice({
    name: "cfg",
    initialState: {
        msg: '',
        notify: {
            leads: false,
            companies: false,
            chat: false,
        }
    },
    reducers: {
        setMsg: (state, { payload }) => {
            state.msg = payload || "";
        },
        setNotify: (state, { payload }) => {
            state.notify = { ...state.notify, ...payload }
        }
    }
});

export const { setMsg, setNotify } = cfg.actions;
export default cfg.reducer;