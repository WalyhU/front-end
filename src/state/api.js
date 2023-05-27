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
    deleteTarea: builder.query({
      query: (body) => ({
        url: `tareas/eliminar/`,
        method: "DELETE",
        body,
      }),
      providesTags: ["Tareas"],
    }),
  }),
});

export const { useGetTareasQuery, useDeleteTareaQuery } = api;
