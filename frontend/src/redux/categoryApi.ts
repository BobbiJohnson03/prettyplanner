import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";

export interface Category {
  id: string; // Correctly using 'id'
  name: string;
  color: string;
  userId: string;
}

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5229/api", // Ensure this matches your backend API base URL
    // Automatically prepare Authorization header with JWT token
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Category"], // Define tag type for caching and invalidation
  endpoints: (builder) => ({
    // Query to get all categories for a specific user
    getCategoriesByUser: builder.query<Category[], string>({
      query: (userId) => `categories/user/${userId}`,
      providesTags: ["Category"], // Invalidate this tag to refetch when categories change
    }),
    // Mutation to add a new category
    addCategory: builder.mutation<Category, Partial<Category>>({
      query: (newCategory) => ({
        url: "categories",
        method: "POST",
        body: newCategory, // `newCategory` now sends camelCase (name, color, userId) matching backend
      }),
      invalidatesTags: ["Category"], // Invalidate list after adding
    }),
    // Mutation to update an existing category
    updateCategory: builder.mutation<
      Category,
      { id: string; updated: Partial<Category> } // 'updated' now contains all camelCase fields
    >({
      query: ({ id, updated }) => ({
        url: `categories/${id}`,
        method: "PUT",
        body: updated, // `updated` now sends camelCase (name, color, userId, etc.) matching backend
      }),
      invalidatesTags: ["Category"], // Invalidate list after updating
    }),
    // Mutation to delete a category
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"], // Invalidate list after deleting
    }),
  }),
});

export const {
  useGetCategoriesByUserQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
