import { createSlice } from "@reduxjs/toolkit";

export const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    temperature: "",
    iconCode: "",
    description: "",
    sunrise: 0,
    sunset: 0,
    humidity: 0,
    location: "NorthChattanooga",
  },
  reducers: {
    setTemperature: (state, action) => {
      state.temperature = action.payload;
    },
    setIconCode: (state, action) => {
      state.iconCode = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setDesciption: (state, action) => {
      state.description = action.payload;
    },
    setSunrise: (state, action) => {
      state.sunrise = action.payload;
    },
    setSunset: (state, action) => {
      state.sunset = action.payload;
    },
    setHumidity: (state, action) => {
      state.humidity = action.payload;
    },
  },
});

export const {
  setTemperature,
  setIconCode,
  setLocation,
  setDesciption,
  setSunrise,
  setSunset,
  setHumidity,
} = weatherSlice.actions;

export default weatherSlice.reducer;
