import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./authApi";
import { kanbanApi } from "./kanbanApi";
import { categoryApi } from "./categoryApi";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    // RTK Query API reducers
    [authApi.reducerPath]: authApi.reducer,
    [kanbanApi.reducerPath]: kanbanApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    // Custom Redux slices
    auth: authReducer,
  },
  // Add API middleware to the Redux store
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      kanbanApi.middleware,
      categoryApi.middleware
    ),
});

// Define RootState and AppDispatch types for Redux hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
