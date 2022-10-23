import { parseISO, formatISO } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material";
import { setCurrentDate } from "../redux/slices/mainSlice";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import {
  PickersDay,
  LocalizationProvider,
  pickersDayClasses,
} from "@mui/x-date-pickers";

export const MobileDatePicker = ({ isWeb }) => {
  const dispatch = useDispatch();
  const { currentDate, isDark } = useSelector((state) => state.main);

  const todaySelected =
    currentDate === formatISO(new Date(), { representation: "date" });

  const theme = createTheme({
    components: {
      MuiCalendarPicker: {
        styleOverrides: {
          root: {
            backgroundColor: isDark === true ? "#222" : "#f0f0f0",
          },
        },
      },
      MuiPickersCalendarHeader: {
        styleOverrides: {
          label: {
            color: isDark === true ? "#f0f0f0" : "#222",
          },
          root: {
            color: isDark === true ? "#f0f0f0" : "#222",
          },
          labelContainer: {
            fontSize: "1.2rem",
          },
        },
      },
      MuiPickersArrowSwitcher: {
        styleOverrides: {
          root: {
            color: isDark === true ? "#f0f0f0" : "#222",
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: isDark === true ? "#f0f0f0" : "#222",
          },
        },
      },
      MuiSelected: {
        styleOverrides: {
          root: {
            color: isDark === true ? "#f0f0f0" : "#222",
          },
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: {
            color: isDark === true ? "#f0f0f0" : "#222",
            backgroundColor: isDark === true ? "#222" : "#f0f0f0",
          },
        },
      },
      PrivatePickersYear: {
        styleOverrides: {
          yearButton: {
            color: isDark === true ? "#f0f0f0" : "#222",
          },
        },
      },
      MuiDayPicker: {
        styleOverrides: {
          weekDayLabel: {
            color: isDark === true ? "#f0f0f0" : "#222",
          },
        },
      },
      MuiCalendarOrClockPicker: {
        styleOverrides: {
          root: {
            backgroundColor: isDark === true ? "#222" : "#f0f0f0",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            color: todaySelected
              ? "#F39887"
              : isDark === true
              ? "#f0f0f0"
              : "#222",
          },
        },
      },
      MuiPickerStaticWrapper: {
        styleOverrides: {
          content: {
            borderRadius: "12px",
          },
        },
      },
    },
  });

  const renderWeekPickerDay = (date, selectedDates, pickersDayProps) => {
    return (
      <PickersDay
        {...pickersDayProps}
        sx={{
          [`&&.${pickersDayClasses.selected}`]: {
            backgroundColor: "#F39887",
          },
          [`&&.${pickersDayClasses.root}:hover`]: {
            backgroundColor: "#F39887",
          },
          [`&&.${pickersDayClasses.root}`]: {
            fontSize: "1rem",
          },
          [`&&.${pickersDayClasses.disabled}`]: {
            textDecoration: "line-through",
            color: isDark ? "#848484" : "#c4c4c4",
          },
        }}
      />
    );
  };

  const handleDateChange = (date) => {
    const isoDate = formatISO(date, { representation: "date" });
    dispatch(setCurrentDate(isoDate));
  };

  return (
    <div className="mx-auto">
      {!isWeb && (
        <h1 className="text-center md:text-left font-bold text-2xl md:text-4xl z-30 py-3 text-[#222] dark:text-[#f0f0f0]">
          View Past Articles
        </h1>
      )}
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <StaticDatePicker
            onChange={handleDateChange}
            renderInput={(params) => <TextInput {...params} />}
            componentsProps={{
              actionBar: {
                actions: ["today", "yesterday"],
              },
            }}
            displayStaticWrapperAs="desktop"
            minDate={parseISO("2022-10-04")}
            renderDay={renderWeekPickerDay}
            value={parseISO(currentDate)}
            // Year will go in this list once 2023 rolls around
            views={["month", "day"]}
            disableFuture
          />
        </LocalizationProvider>
      </ThemeProvider>
    </div>
  );
};
