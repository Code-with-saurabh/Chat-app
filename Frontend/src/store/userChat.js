import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
};

export const ChatSlice = createSlice({
  name: 'userChat',
  initialState,
  reducers: {
    setAllMessages: (state, action) => {
      state.messages = action.payload;
    },
    setMessage: (state, action) => {
      const { senderId, receiverId, reciverId, message, time } = action.payload;

      state.messages.push({
        sender: senderId,
        receiver: receiverId || reciverId,
        message,
        time,
      });
    },
    removeMessage: (state) => {
      state.messages = [];
    },
  },
});

export const { setAllMessages, setMessage, removeMessage } = ChatSlice.actions;
export default ChatSlice.reducer;
