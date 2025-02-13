import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	id:'',
  username: '',
  profileImage: '',
};

export const secondUserSlice = createSlice({
	 name: 'secondUser',
  initialState,
  reducers: {
    addSecondUser: (state, action) => {
      state.id = action.payload.id;  
      state.username = action.payload.username;  
      state.profileImage = action.payload.profileImage;  
    },
    removeSecondUser: (state) => {
      state.id = '';  
      state.username = '';  
      state.profileImage = '';
    },
  },
});

export const { addSecondUser, removeSecondUser } = secondUserSlice.actions;
export default secondUserSlice.reducer;