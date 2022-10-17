import { useDispatch } from "react-redux";
import { parseISO, formatISO } from "date-fns";
import { setCurrentDate } from "../redux/slices/mainSlice";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";

export const DatePicker = () => {
  const dispatch = useDispatch();
  return (
    <div className="text-[#222] dark:text-[#f0f0f0] bg-slate-500 dark:bg-yellow-600">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StaticDatePicker
          onChange={(date) =>
            dispatch(
              setCurrentDate(formatISO(date, { representation: "date" }))
            )
          }
          displayStaticWrapperAs="desktop"
          renderInput={(params) => <div {...params} />}
          minDate={parseISO("2022-10-04")}
          disableFuture
        />
      </LocalizationProvider>
    </div>
  );
};
