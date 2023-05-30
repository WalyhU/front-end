import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "https://localhost:7225" }),
  reducerPath: "proyectoApi",
  tagTypes: ["Tareas"],
  endpoints: (builder) => ({
    getTareas: builder.query({
      query: () => "tareas/listar/",
      providesTags: ["Tareas"],
    }),
    deleteTarea: builder.mutation({
      query: (body) => ({
        url: `tareas/eliminar/`,
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Tareas"],
    }),
    addTarea: builder.mutation({
      query: (body) => ({
        url: `tareas/agregar/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tareas"],
    }),
  }),
});

export const { useGetTareasQuery, useDeleteTareaMutation, useAddTareaMutation } = api;
