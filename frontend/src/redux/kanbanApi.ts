import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store"; // Assuming RootState is defined in store.ts

export interface KanbanTask {
  id: string; // ID is always a string when it exists (from DB)
  title: string;
  description: string;
  deadline: string; // ISO string format
  priority: string;
  status: "todo" | "inProgress" | "done";
  color: string;
  userId: string;
  createdAt?: string; // ISO string format, optional as it's generated
  category: string; // Changed to required string (can be empty string if no category selected)
}

export const kanbanApi = createApi({
  reducerPath: "kanbanApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5229/api/kanbantasks", // Base URL specific to KanbanTasks
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["KanbanTask"],
  endpoints: (builder) => ({
    getTasksByUser: builder.query<KanbanTask[], string>({
      query: (userId) => `/user/${userId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "KanbanTask" as const,
                id: id,
              })),
              { type: "KanbanTask", id: "LIST" },
            ]
          : [{ type: "KanbanTask", id: "LIST" }],
    }),

    // For adding a task, 'id' should be optional (or completely omitted)
    addTask: builder.mutation<KanbanTask, Omit<Partial<KanbanTask>, 'id' | 'createdAt'>>({ // Omit 'id' and 'createdAt' from payload
      query: (task) => ({
        url: "/",
        method: "POST",
        body: task, // `task` payload will not contain 'id'
      }),
      invalidatesTags: [{ type: "KanbanTask", id: "LIST" }],
    }),

    updateTask: builder.mutation<
      KanbanTask,
      { id: string; updated: Partial<KanbanTask> }
    >({
      query: ({ id, updated }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updated,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "KanbanTask", id },
        { type: "KanbanTask", id: "LIST" },
      ],
    }),

    deleteTask: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "KanbanTask", id },
        { type: "KanbanTask", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetTasksByUserQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = kanbanApi;
