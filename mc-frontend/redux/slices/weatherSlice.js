import { createSlice } from "@reduxjs/toolkit";

export const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    currentTemp: "",
    currentWeatherCode: "",
    weatherDescription: "",
    currentSunrise: 0,
    currentSunset: 0,
    currentHumidity: 0,
  },
  reducers: {
    setCurrentTemp: (state, action) => {
      state.currentTemp = action.payload;
    },
    setCurrentWeatherCode: (state, action) => {
      state.currentWeatherCode = action.payload;
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
  setCurrentWeatherCode,
  setWeatherDescription,
  setCurrentSunrise,
  setCurrentSunset,
  setCurrentHumidity,
} = weatherSlice.actions;

export default weatherSlice.reducer;
