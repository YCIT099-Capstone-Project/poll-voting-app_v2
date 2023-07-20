import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    key: null,
    lastActive: null,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.lastActive = Date.now(); // Add the login timestamp here
    },
    logout: (state) => {
      state.user = null;
      state.lastActive = null;
    },
    updateLastActive: (state, action) => {
      state.lastActive = action.payload;
    },
  },
});

export const { login, logout, updateLastActive } = userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectLastActive = (state) => state.user.lastActive;

export default userSlice.reducer;
