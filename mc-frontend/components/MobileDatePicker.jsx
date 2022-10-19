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

export const MobileDatePicker = () => {
  const dispatch = useDispatch();
  const { currentDate, isDark } = useSelector((state) => state.main);

  const theme = createTheme({
    components: {
      MuiCalendarPicker: {
        styleOverrides: {
          root: {
            "background-color": isDark === true ? "#222" : "#f0f0f0",
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
            "background-color": isDark === true ? "#222" : "#f0f0f0",
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
            "background-color": isDark === true ? "#222" : "#f0f0f0",
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
            "background-color": "#F39887",
          },
          [`&&.${pickersDayClasses.root}:hover`]: {
            "background-color": "#F39887",
          },
        }}
      />
    );
  };

  return (
    <div className="flex-auto mx-auto">
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <StaticDatePicker
            onChange={(date) => {
              const isoDate = formatISO(date, { representation: "date" });
              dispatch(setCurrentDate(isoDate));
            }}
            renderInput={(params) => <TextInput {...params} />}
            componentsProps={{
              actionBar: {
                actions: ["today", "yesterday"],
              },
            }}
            displayStaticWrapperAs="desktop"
            minDate={parseISO("2022-10-04")}
            renderDay={renderWeekPickerDay}
            InputProps={{
              className: "text-yellow-800",
            }}
            value={parseISO(currentDate)}
            views={["month", "day"]}
            disableFuture
          />
        </LocalizationProvider>
      </ThemeProvider>
    </div>
  );
};
