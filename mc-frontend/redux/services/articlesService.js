import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const articlesApi = createApi({
  reducerPath: "articlesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.mychattanooga.app/articles",
  }),
  endpoints: (builder) => ({
    getArticlesByDate: builder.query({
      query: (date) => `?query_date=${date}`,
    }),
  }),
});

// Auto generated from the createApi endpoint
export const { useGetArticlesByDateQuery } = articlesApi;
