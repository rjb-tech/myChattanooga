import { createSlice } from "@reduxjs/toolkit";

export const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    currentTemp: "",
    weatherCode: "",
    weatherDescription: "",
    currentSunrise: 0,
    currentSunset: 0,
    currentHumidity: 0,
    location: "northChattanooga",
  },
  reducers: {
    setCurrentTemp: (state, action) => {
      state.currentTemp = action.payload;
    },
    setWeatherCode: (state, action) => {
      state.currentWeatherCode = action.payload;
    },
    setWeatherLocation: (state, action) => {
      state.location = action.payload;
    },
    setWeatherDescription: (state, action) => {
      state.weatherDescription = action.payload;
    },
    setCurrentSunrise: (state, action) => {
      state.currentSunrise = action.payload;
    },
    setCurrentSunset: (state, action) => {
      state.currentSunset = action.payload;
    },
    setCurrentHumidity: (state, action) => {
      state.currentHumidity = action.payload;
    },
  },
});

export const {
  setCurrentTemp,
  setWeatherCode,
  setWeatherLocation,
  setWeatherDescription,
  setCurrentSunrise,
  setCurrentSunset,
  setCurrentHumidity,
} = weatherSlice.actions;

export default weatherSlice.reducer;
