import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: { socket: null, onlineUsers: null },

  reducers: {
    setsocketData(state, action) {
      state.socket = action.payload;
    },
    setOnlineUseers(state, action) {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setsocketData, setOnlineUseers } = socketSlice.actions;
export default socketSlice.reducer;
