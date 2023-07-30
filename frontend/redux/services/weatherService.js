import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const weatherApi = createApi({
  reducerPath: "weatherApi",
  skip: true,
  mode: "no-cors",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: 60,
  baseQuery: fetchBaseQuery({
    baseUrl: "api/weather",
  }),
  endpoints: (builder) => ({
    getWeatherByLocation: builder.query({
      query: (location) => `?location=${location}`,
    }),
  }),
});

// Auto generated from the createApi endpoint
export const { useGetWeatherByLocationQuery } = weatherApi;
