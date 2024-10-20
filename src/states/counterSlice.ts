import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
    name: 'counter',
    initialState: 1,
    reducers: {
        increment: function (state) {return state + 1},
        decrement: function (state) {return state - 1}
    }
});

export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;