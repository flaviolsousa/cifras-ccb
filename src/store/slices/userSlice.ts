// src/store/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  loggedIn: boolean;
  name?: string;
  email?: string;
  photoUrl?: string;
}

const initialState: UserState = {
  loggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ name: string; email: string; photoUrl: string }>) {
      state.loggedIn = true;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.photoUrl = action.payload.photoUrl;
    },
    logout(state) {
      state.loggedIn = false;
      state.name = undefined;
      state.email = undefined;
      state.photoUrl = undefined;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
