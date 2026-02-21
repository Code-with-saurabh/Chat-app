import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  username: null,
  profileImage: null,
};

const secondUserSlice = createSlice({
  name: "secondUser",
  initialState,
  reducers: {
    setSecondUser: (state, action) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.profileImage = action.payload.profileImage;
    },
    clearSecondUser: (state) => {
      state.id = null;
      state.username = null;
      state.profileImage = null;
    },
  },
});

export const { setSecondUser, clearSecondUser } = secondUserSlice.actions;
export default secondUserSlice.reducer;