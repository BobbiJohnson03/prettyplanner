import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./authApi";
import { kanbanApi } from "./kanbanApi";
import { categoryApi } from "./categoryApi";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [kanbanApi.reducerPath]: kanbanApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      kanbanApi.middleware,
      categoryApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
