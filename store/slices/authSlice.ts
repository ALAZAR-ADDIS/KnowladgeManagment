import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Role } from "./types";

type AuthUser = {
  id: string;
  name: string;
  role: Role;
  email: string;
  password: string;
};

type AuthState = {
  currentUser: AuthUser | null;
  currentRole: Role | null;
  isAuthenticated: boolean;
  availableUsers: AuthUser[];
  loginError: string | null;
};

const availableUsers: AuthUser[] = [
  { id: "u1", name: "Inspector Dawit", role: "admin", email: "admin@efpc.local", password: "Admin@123" },
  { id: "u2", name: "Officer Hana", role: "officer", email: "officer@efpc.local", password: "Officer@123" },
  { id: "u3", name: "Analyst Bekele", role: "viewer", email: "viewer@efpc.local", password: "Viewer@123" },
];

const initialState: AuthState = {
  currentUser: null,
  currentRole: null,
  isAuthenticated: false,
  availableUsers,
  loginError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginWithCredentials: (state, action: PayloadAction<{ email: string; password: string }>) => {
      const normalizedEmail = action.payload.email.trim().toLowerCase();
      const normalizedPassword = action.payload.password.trim();
      const found = state.availableUsers.find(
        (u) => u.email.toLowerCase() === normalizedEmail && u.password === normalizedPassword,
      );

      if (!found) {
        state.currentUser = null;
        state.currentRole = null;
        state.isAuthenticated = false;
        state.loginError = "Invalid email or password.";
        return;
      }

      state.currentUser = found;
      state.currentRole = found.role;
      state.isAuthenticated = true;
      state.loginError = null;
    },
    loginAsUser: (state, action: PayloadAction<string>) => {
      const found = state.availableUsers.find((u) => u.id === action.payload);
      if (found) {
        state.currentUser = found;
        state.currentRole = found.role;
        state.isAuthenticated = true;
        state.loginError = null;
      }
    },
    clearAuthError: (state) => {
      state.loginError = null;
    },
    switchRoleForDemo: (state, action: PayloadAction<Role>) => {
      if (!state.currentUser) return;
      state.currentRole = action.payload;
      state.currentUser = { ...state.currentUser, role: action.payload };
    },
    logout: (state) => {
      state.currentUser = null;
      state.currentRole = null;
      state.isAuthenticated = false;
      state.loginError = null;
    },
  },
});

export const { loginWithCredentials, loginAsUser, clearAuthError, switchRoleForDemo, logout } = authSlice.actions;
export default authSlice.reducer;
