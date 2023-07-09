import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const articlesApi = createApi({
  reducerPath: "articlesApi",
  skip: true,
  mode: "cors",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: 300,
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/articles`,
  }),
  endpoints: (builder) => ({
    getArticlesByDate: builder.query({
      query: (date) => `?query_date=${date}`,
    }),
  }),
});

// Auto generated from the createApi endpoint
export const { useGetArticlesByDateQuery } = articlesApi;
