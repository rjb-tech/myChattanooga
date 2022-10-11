import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const weatherApi = createApi({
  reducerPath: "weatherApi",
  refetchOnFocus: true,
  refetchOnMountOrArgChange: 60,
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/weather`,
  }),
  endpoints: (builder) => ({
    getWeatherByLocation: builder.query({
      query: (location) => `?location=${location}`,
    }),
  }),
});

// Auto generated from the createApi endpoint
export const { useGetWeatherByLocationQuery } = weatherApi;
