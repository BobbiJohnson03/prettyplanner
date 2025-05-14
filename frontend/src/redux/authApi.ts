import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// 👤 User model
export interface User {
  _id: string;
  username: string;
  email: string;
}

// 🔐 Auth response from backend
export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5229/api", // Adjust if needed
    // credentials: "include", // <- ONLY if you're using cookies
  }),
  tagTypes: ["User"], // Optional: for cache management
  endpoints: (builder) => ({
    // 📝 Register
    registerUser: builder.mutation<
      void,
      { username: string; email: string; password: string }
    >({
      query: ({ username, email, password }) => ({
        url: "/auth/register",
        method: "POST",
        body: {
          username,
          email,
          passwordHash: password, // your backend expects 'passwordHash'
        },
      }),
    }),

    // 🔓 Login
    loginUser: builder.mutation<
      AuthResponse,
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // 🚪 Logout
    logoutUser: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    // 👁️‍🗨️ Get user by ID
    getUser: builder.query<User, string>({
      query: (userId) => `/users/${userId}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    // ✏️ Update user
    updateUser: builder.mutation<
      User,
      { userId: string; updatedUser: Partial<User> }
    >({
      query: ({ userId, updatedUser }) => ({
        url: `/users/${userId}`,
        method: "PUT",
        body: updatedUser,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "User", id: userId },
      ],
    }),

    // 🗑️ Delete user
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
  useLogoutUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = authApi;
