import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: '',
  profileImage: '',
};

export const secondUserSlice = createSlice({
	 name: 'secondUser',
  initialState,
  reducers: {
    addSecondUser: (state, action) => {
      state.username = action.payload.username;  
      state.profileImage = action.payload.profileImage;  
    },
    removeSecondUser: (state) => {
      state.username = '';  
      state.profileImage = '';
    },
  },
});

export const { addSecondUser, removeSecondUser } = secondUserSlice.actions;
export default secondUserSlice.reducer;