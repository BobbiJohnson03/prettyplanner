import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";

export interface Category {
  id: string;
  name: string;
  color: string;
  userId: string;
}

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5229/api", // Changed from "/api" to full URL
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    getCategoriesByUser: builder.query<Category[], string>({
      query: (userId) => `categories/user/${userId}`, // Removed leading slash
      providesTags: ["Category"],
    }),
    addCategory: builder.mutation<Category, Partial<Category>>({
      query: (newCategory) => ({
        url: "categories", // Removed leading slash
        method: "POST",
        body: newCategory,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation<
      Category,
      { id: string; updated: Partial<Category> }
    >({
      query: ({ id, updated }) => ({
        url: `categories/${id}`, // Removed leading slash
        method: "PUT",
        body: updated,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `categories/${id}`, // Removed leading slash
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesByUserQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
