import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const articlesApi = createApi({
  reducerPath: "articlesApi",
  skip: true,
  mode: "cors",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: 300,
  baseQuery: fetchBaseQuery({
    baseUrl: `api/articles`,
  }),
  endpoints: (builder) => ({
    getArticlesByDate: builder.query({
      query: (date) => `?published=${date}`,
    }),
  }),
});

// Auto generated from the createApi endpoint
export const { useGetArticlesByDateQuery } = articlesApi;
