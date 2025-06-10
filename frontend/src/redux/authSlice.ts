import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./authApi"; // User interface now uses 'id'

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  // Initialize user from localStorage, handling potential parsing errors
  user: (() => {
    try {
      const stored = localStorage.getItem("user");
      // Check if stored is a valid JSON string before parsing
      return stored ? JSON.parse(stored) : null;
    } catch {
      // If parsing fails, return null
      return null;
    }
  })(),
  // Initialize token from localStorage
  token: localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Sets user and token, then stores them in localStorage
    setUser(state, action: PayloadAction<{ user: User; token: string }>) {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    },
    // Clears user and token, then removes them from localStorage
    clearUser(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;
