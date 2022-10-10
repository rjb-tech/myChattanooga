import { createSlice } from "@reduxjs/toolkit";

export const mainSlice = createSlice({
  name: "main",
  initialState: {
    menuExpanded: false,
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
    setMenuExpanded: (state, action) => {
      state.menuExpanded = action.payload;
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
      state.menuExpanded = !state.menuExpanded;
    },
    toggleMobileUserPanel: (state) => {
      if (state.auxPanelExpanded === true) {
        state.auxPanelExpanded = !state.auxPanelExpanded;
        // This conditional accounts for this function being called from a non mobile view
        if (state.panelExpanded === true) {
          setTimeout(() => {
            state.panelExpanded = !state.panelExpanded;
            state.currentAuxSection = "";
          }, 150);
        }
        setTimeout(() => {
          state.currentAuxSection = "";
        }, 150);
      } else {
        state.panelExpanded = !state.panelExpanded;
      }
    },
  },
});

// This makes action creators
export const {
  setMenuExpanded,
  setAuxPanelExpanded,
  setFilterApplied,
  setPageContent,
  setFilterOptions,
  setCurrentPage,
  setCurrentAuxSection,
  setPreviousFilter,
  setCurrentWeatherLocation,
  toggleMobileNav,
  toggleMobileUserPanel,
} = mainSlice.actions;

export default mainSlice.reducer;
