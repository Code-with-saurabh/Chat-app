import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [], //  messages array  
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

      // Use correct key names inside messages[]
      state.messages.push({
        sender: senderId,
        receiver: receiverId || reciverId,  // ? supports both spellings
        message,
        time,  // ? this fixes 12:00 AM issue
      });
    },
    removeMessage: (state) => {
      state.messages = [];
    },
  },
});

export const { setAllMessages, setMessage, removeMessage } = ChatSlice.actions;
export default ChatSlice.reducer;