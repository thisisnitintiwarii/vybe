import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: { selectedUser: null, message: [], prevChatUsers: null },

  reducers: {
    setSelectedUser(state, action) {
      state.selectedUser = action.payload;
    },
    setMessages(state, action) {
      state.message = action.payload;
    },
    setPrevChatsUsers(state, action) {
      state.prevChatUsers = action.payload;
    },
  },
});

export const { setSelectedUser, setMessages,setPrevChatsUsers } = messageSlice.actions;
export default messageSlice.reducer;
