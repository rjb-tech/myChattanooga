import { createSlice } from "@reduxjs/toolkit";

export const mainSlice = createSlice({
  name: "main",
  initialState: {
    articles: [],
    stats: [],
  },
  reducers: {},
});
