import { configureStore } from '@reduxjs/toolkit';
import UserReducer from './userSlice';
import chatReducer from './chatSlice';
import secondUserReducer from './secondUserSlice';
const store = configureStore({
	reducer: {
		user: UserReducer,
		chat: chatReducer,
		 secondUser: secondUserReducer, 
	},
});

export default store;
