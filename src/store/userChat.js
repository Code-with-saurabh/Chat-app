import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   senderId:"",
   reciverId:"",
   message:"",
};

export const ChatSlice = createSlice({
  name: 'userChat',
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.senderId = action.payload.senderId;  
      state.reciverId = action.payload.reciverId;  
      state.message = action.payload.message;  
    },
    removeMessage: (state) => {
       state.senderId = "";  
      state.reciverId = "";  
      state.message = "";  
    },
  },
});

export const { setMessage, removeMessage } = ChatSlice.actions;
export default ChatSlice.reducer;