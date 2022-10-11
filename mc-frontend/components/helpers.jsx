// This is covering some tech debt related to the scraper passing back date as strings
export function calculateTimeSincePosted(timePosted) {
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();
  const timePostedHour = timePosted.slice(0, 2);
  const timePostedMinute = timePosted.slice(3, 5);

  let hoursSincePosted = parseInt(currentHour) - parseInt(timePostedHour);
  const minutesSincePosted =
    parseInt(currentMinute) - parseInt(timePostedMinute);

  // round up if minutes since posted is over 30.
  // example: 2 hours 30 minutes would mean posted 3 hours ago
  if (minutesSincePosted >= 30) {
    hoursSincePosted += 1;
  }

  if (hoursSincePosted === 0) {
    return minutesSincePosted === 0
      ? "Published just now"
      : `Published about ${minutesSincePosted} minutes ago`;
  } else {
    return hoursSincePosted === 1
      ? `Published about ${hoursSincePosted} hour ago`
      : `Published about ${hoursSincePosted} hours ago`;
  }
}

export function isFromTheFuture(timePosted) {
  // This is hacky, but it's needed for now to avoid errors when switching between pages
  if (timePosted === undefined) {
    return true;
  }
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();
  const timePostedHour = timePosted.slice(0, 2);
  const timePostedMinute = timePosted.slice(3, 5);

  const hoursSincePosted = parseInt(currentHour) - parseInt(timePostedHour);
  const minutesSincePosted =
    parseInt(currentMinute) - parseInt(timePostedMinute);

  if (hoursSincePosted < 0) {
    return true;
  } else if (hoursSincePosted === 0) {
    if (minutesSincePosted < 0) {
      return true;
    }
    return false;
  }
}

import {
  setAuxPanelExpanded,
  setCurrentAuxSection,
  setPanelExpanded,
} from "../redux/mainSlice";
const TIMEOUT_VALUE = 150;
export function toggleMobileUserPanel(
  dispatch,
  auxPanelExpanded,
  panelExpanded
) {
  if (auxPanelExpanded === true) {
    dispatch(setAuxPanelExpanded(!auxPanelExpanded));
    // This conditional accounts for this function being called from a non mobile view
    if (panelExpanded === true) {
      setTimeout(() => {
        dispatch(setPanelExpanded(!panelExpanded));
        dispatch(setCurrentAuxSection(""));
      }, TIMEOUT_VALUE);
    }
    setTimeout(() => {
      dispatch(setCurrentAuxSection(""));
    }, TIMEOUT_VALUE);
  } else {
    dispatch(setPanelExpanded(!panelExpanded));
  }
}
