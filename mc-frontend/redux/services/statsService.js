import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const statsApi = createApi({
  reducerPath: "statsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.mychattanooga.app/stats",
  }),
  endpoints: (builder) => ({
    getStatsByDate: builder.query({
      query: (date) => `?query_date=${date}`,
    }),
  }),
});

// Auto generated from the createApi endpoint
export const { useGetStatsByDateQuery } = statsApi;
