import { createSlice } from "@reduxjs/toolkit";

export const mainSlice = createSlice({
  name: "main",
  initialState: {
    mobileNavExpanded: false,
    panelExpanded: false,
    auxPanelExpanded: false,
    filterApplied: "all",
    previousFilter: "",
    pageContent: [], // hopefully this is temporary
    filterOptions: [],
    currentAuxSection: "",
    isDark: true,
    weatherLocation: "northChattanooga",
  },
  reducers: {
    setMobileNavExpanded: (state, action) => {
      state.mobileNavExpanded = action.payload;
    },
    setPanelExpanded: (state, action) => {
      state.panelExpanded = action.payload;
    },
    setAuxPanelExpanded: (state, action) => {
      state.auxPanelExpanded = action.payload;
    },
    setFilterApplied: (state, action) => {
      state.filterApplied = action.payload;
    },
    // Hopefully this is temporary as well
    setPageContent: (state, action) => {
      state.pageContent = action.payload;
    },
    setFilterOptions: (state, action) => {
      state.filterOptions = action.payload;
    },
    setCurrentAuxSection: (state, action) => {
      state.currentAuxSection = action.payload;
    },
    setPreviousFilter: (state, action) => {
      state.previousFilter = action.payload;
    },
    setIsDark: (state, action) => {
      state.isDark = action.payload;
    },
    setWeatherLocation: (state, action) => {
      state.weatherLocation = action.payload;
    },
    toggleMobileNav: (state) => {
      state.mobileNavExpanded = !state.mobileNavExpanded;
    },
  },
});

// This makes action creators
export const {
  setMobileNavExpanded,
  setPanelExpanded,
  setAuxPanelExpanded,
  setFilterApplied,
  setPageContent,
  setFilterOptions,
  setCurrentAuxSection,
  setPreviousFilter,
  setWeatherLocation,
  toggleMobileNav,
  setIsDark,
} = mainSlice.actions;

export default mainSlice.reducer;