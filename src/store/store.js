import { configureStore } from '@reduxjs/toolkit';
import UserReducer from './userSlice';
import chatReducer from './chatSlice';
import secondUserReducer from './secondUserSlice';
import notificationReducer from './notificationSlice.js';
const store = configureStore({
	reducer: {
		user: UserReducer,
		chat: chatReducer,
		 secondUser: secondUserReducer, 
		 notification:notificationReducer
	},
});

export default store;
