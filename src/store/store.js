import {configureStore} from '@reduxjs/toolkit';
import UserReducer from './userSlice.js';
import secondUserSlice from './secondUserSlice .js';
import UserChat from './userChat.js';
const store  = configureStore({
	reducer:{
		user: UserReducer,
		secondUser:secondUserSlice,
		userChat:UserChat,
	},
});

export default  store;