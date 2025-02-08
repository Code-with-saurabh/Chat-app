import {configureStore} from '@reduxjs/toolkit';
import UserReducer from './userSlice.js';
import secondUserSlice from './secondUserSlice .js';
const store  = configureStore({
	reducer:{
		user: UserReducer,
		secondUser:secondUserSlice,
	},
});

export default  store;