import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const statsApi = createApi({
  reducerPath: "statsApi",
  refetchOnFocus: true,
  refetchOnMountOrArgChange: 600,
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/stats`,
  }),
  endpoints: (builder) => ({
    getStatsByDate: builder.query({
      query: (date) => `?query_date=${date}`,
    }),
  }),
});

// Auto generated from the createApi endpoint
export const { useGetStatsByDateQuery } = statsApi;
