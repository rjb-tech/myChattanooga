// This is covering some tech debt related to the scraper passing back date as strings
export function calculateTimeSincePosted (timePosted) {
    const currentDate = new Date();
    const currentHour = currentDate.getUTCHours();
    const currentMinute = currentDate.getUTCMinutes();
    const timePostedHour = timePosted.slice(0,2);
    const timePostedMinute = timePosted.slice(3,5);

    const hoursSincePosted = parseInt(currentHour) - parseInt(timePostedHour);
    const minutesSincePosted = parseInt(currentMinute) - parseInt(timePostedMinute);

    // round up if minutes since posted is over 30.
    // example: 2 hours 30 minutes would mean posted 3 hours ago
    if (minutesSincePosted >= 30) {
        hoursSincePosted += 1;
    }

    if (hoursSincePosted === 0) {
        return `Published about ${minutesSincePosted} minutes ago`
    }
    else {
        return hoursSincePosted === 1 
            ? `Published about ${hoursSincePosted} hour ago` 
            : `Published about ${hoursSincePosted} hours ago`
    }
}