import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   senderId:"",
   reciverId:"",
   messages: [],
};

export const ChatSlice = createSlice({
  name: 'userChat',
  initialState,
  reducers: {
    setMessage: (state, action) => {
      // state.senderId = action.payload.senderId;  
      // state.reciverId = action.payload.reciverId;  
      // state.message = action.payload.message; 
	const { senderId, reciverId, message } = action.payload;	 
	state.messages.push({ senderId, reciverId, message });
      state.senderId = senderId;
      state.reciverId = reciverId;	
    },
    removeMessage: (state) => {
       state.senderId = "";  
      state.reciverId = "";  
      state.message = [];  
    },
  },
});

export const { setMessage, removeMessage } = ChatSlice.actions;
export default ChatSlice.reducer;