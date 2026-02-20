import { configureStore } from '@reduxjs/toolkit';
import UserReducer from './userSlice';
import chatReducer from './chatSlice';

const store = configureStore({
	reducer: {
		user: UserReducer,
		chat: chatReducer,
	},
});

export default store;
