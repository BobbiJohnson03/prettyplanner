import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store"; // Assuming RootState is defined in store.ts

// 👤 User model - Changed _id to id for consistency with backend login response
export interface User {
  id: string;
  username: string;
  email: string;
  // If avatarUrl exists on backend, add it here:
  // avatarUrl?: string;
}

// 🔐 Auth response from backend
export interface AuthResponse {
  message: string;
  user: User; // User object now has 'id'
  token: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5229/api", // Adjust for deployment
    // This prepareHeaders function will automatically attach the JWT to ALL requests
    // originating from this API slice, assuming a token is present in Redux state.
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User"], // Optional: for cache management
  endpoints: (builder) => ({
    // 📝 Register
    registerUser: builder.mutation<
      void,
      { username: string; email: string; password: string }
    >({
      query: (credentials) => ({ // credentials now directly maps to camelCase backend
        url: "/auth/register",
        method: "POST",
        body: credentials, // Backend now expects camelCase (username, email, password)
      }),
    }),

    // 🔓 Login
    loginUser: builder.mutation<
      AuthResponse,
      { email: string; password: string }
    >({
      query: (credentials) => ({ // credentials now directly maps to camelCase backend
        url: "/auth/login",
        method: "POST",
        body: credentials, // Backend now expects camelCase (email, password)
      }),
    }),

    // 👁️‍🗨️ Get user by ID (will use Authorization header)
    getUser: builder.query<User, string>({
      query: (userId) => `/users/${userId}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    // ✏️ Update user (will use Authorization header)
    // Note: If you add avatar upload, this mutation will need to be updated
    // to handle FormData, or a new mutation specific for profile update created.
    updateUser: builder.mutation<
      User,
      { userId: string; updatedUser: Partial<User> }
    >({
      query: ({ userId, updatedUser }) => ({
        url: `/users/${userId}`,
        method: "PUT",
        body: updatedUser, // Backend now expects camelCase (e.g., username, email, avatarUrl)
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "User", id: userId },
      ],
    }),

    // 🗑️ Delete user (will use Authorization header)
    deleteUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "User", id }],
    }),
  }),
});

// ⛓ Export RTK Query hooks
export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = authApi;

// Removed useLogoutUserMutation as there is no corresponding backend endpoint.
// Client-side logout is handled by clearing the Redux state and localStorage.
