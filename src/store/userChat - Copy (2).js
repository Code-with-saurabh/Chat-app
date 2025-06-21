import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   senderId: "",
   reciverId: "",
   messages: [],
};

export const ChatSlice = createSlice({
	name: 'userChat',
	initialState,
	reducers: {
		setAllMessages: (state, action) => {
			state.messages = action.payload; // Fixed the typo here
		},
		setMessage: (state, action) => {
			const { senderId, reciverId, message } = action.payload;
			state.messages.push({ senderId, reciverId, message });
		},
		removeMessage: (state) => {
			state.messages = []; // Corrected to match the state
		},
	},
});

export const { setAllMessages, setMessage, removeMessage } = ChatSlice.actions;
export default ChatSlice.reducer;
