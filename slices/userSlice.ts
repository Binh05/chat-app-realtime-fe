import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  username: string | null;
  phone: string | null;
  token: string | null;
  avatarUrl: string | null;
  status: boolean | null;
}

const initialState: UserState = {
  username: null,
  phone: null,
  token: null,
  avatarUrl: null,
  status: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      state.username = action.payload?.username ?? state.username;
      state.phone = action.payload?.phone ?? state.phone;
      state.token = action.payload?.token ?? state.token;
      state.avatarUrl = action.payload?.avatarUrl ?? state.avatarUrl;
      state.status = action.payload?.status ?? state.status;
    },
    clearUser: (state) => {
      state.username = null;
      state.phone = null;
      state.token = null;
      state.avatarUrl = null;
      state.status = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
