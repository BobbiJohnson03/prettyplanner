import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./authApi";
import { kanbanApi } from "./kanbanApi"; // ⬅️ Dodaj to
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [kanbanApi.reducerPath]: kanbanApi.reducer, // ⬅️ Dodaj to
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, kanbanApi.middleware), // ⬅️ Dodaj też kanbanApi.middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
