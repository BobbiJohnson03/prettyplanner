import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";

export interface KanbanTask {
  id: string; // zamiast _id
  title: string;
  description: string;
  deadline: string;
  priority: string;
  status: "todo" | "inProgress" | "done";
  color: string;
  userId: string;
  createdAt?: string;
}

export const kanbanApi = createApi({
  reducerPath: "kanbanApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5229/api/kanbantasks",
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
              ...result.map(({ _id }) => ({
                type: "KanbanTask" as const,
                id: _id,
              })),
              { type: "KanbanTask", id: "LIST" },
            ]
          : [{ type: "KanbanTask", id: "LIST" }],
    }),

    addTask: builder.mutation<KanbanTask, Partial<KanbanTask>>({
      query: (task) => ({
        url: "/",
        method: "POST",
        body: task,
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
