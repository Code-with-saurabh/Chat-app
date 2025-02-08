import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: '',
  profileImage:'',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.username = action.payload.username;  
      state.profileImage = action.payload.profileImage;  
    },
    removeUser: (state) => {
      state.username = '';  
	  state.profileImage='';
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;