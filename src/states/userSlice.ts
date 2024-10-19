import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  username: string | null;
  role: string | null;
}

const initialState: UserState = {
  username: null,
  role: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ username: string; role: string }>) => {
      state.username = action.payload.username;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.username = null;
      state.role = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
