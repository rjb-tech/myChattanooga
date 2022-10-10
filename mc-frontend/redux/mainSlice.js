import { createSlice } from "@reduxjs/toolkit";

export const mainSlice = createSlice({
  name: "main",
  initialState: {
    navExpanded: false,
    panelExpanded: false,
    auxPanelExpanded: false,
    filterApplied: "all",
    previousFilter: "",
    pageContent: [], // hopefully this is temporary
    filterOptions: {}, // hopefully this can be derived later on
    currentPage: "",
    currentAuxSection: "",
    isDark: true,
    currentWeatherLocation: "",
  },
  reducers: {
    setNavExpanded: (state, action) => {
      state.navExpanded = action.payload;
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
    setCurrentPage: (state) => {
      state.currentPage = window.location.pathname;
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
    setCurrentWeatherLocation: (state, action) => {
      state.currentWeatherLocation = action.payload;
    },
    toggleMobileNav: (state) => {
      state.navExpanded = !state.navExpanded;
    },
  },
});

// This makes action creators
export const {
  setNavExpanded,
  setPanelExpanded,
  setAuxPanelExpanded,
  setFilterApplied,
  setPageContent,
  setFilterOptions,
  setCurrentPage,
  setCurrentAuxSection,
  setPreviousFilter,
  setCurrentWeatherLocation,
  toggleMobileNav,
} = mainSlice.actions;

export default mainSlice.reducer;
