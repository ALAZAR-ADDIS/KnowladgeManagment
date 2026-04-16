import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./slices/adminSlice";
import authReducer from "./slices/authSlice";
import officerReducer from "./slices/officerSlice";
import viewerReducer from "./slices/viewerSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    officer: officerReducer,
    viewer: viewerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
