import { motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilterApplied, setPreviousFilter } from "../redux/mainSlice";

export const FiltersPanel = ({ currentPage }) => {
  const dispatch = useDispatch();
  const { filterApplied, previousFilter, filterOptions } = useSelector(
    (state) => state.main
  );

  useEffect(() => {
    document
      .getElementById(
        `${previousFilter?.replace(" ", "-").toLowerCase()}-button`
      )
      ?.classList.remove("ring-[#F7BCB1]", "ring-2", "border-xl");
    document
      .getElementById(
        `${filterApplied?.replace(" ", "-").toLowerCase()}-button`
      )
      ?.classList.add("ring-[#F7BCB1]", "ring-2", "border-xl");
  }, [filterApplied]);

  return (
    <div className="h-5/6 w-4/6 md:w-5/6 md:px-0 flex-col mx-auto pb-4">
      {filterOptions.length > 1 && (
        <div className="py-1 md:py-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            aria-label="Apply All Filters Button"
            id="all-button"
            className="flex-auto mx-auto border py-2 rounded-xl w-full hover:border-[#F7BCB1] border-[#F7BCB1] ring-[#F7BCB1] ring-2 border-[#222] dark:border-[#f0f0f0]"
            onClick={() => {
              dispatch(setPreviousFilter(filterApplied));
              dispatch(setFilterApplied("all"));
            }}
          >
            All Publishers
          </motion.button>
        </div>
      )}
      {filterOptions.map((currentOption) => {
        return (
          <div className="py-1 md:py-2" key={currentOption}>
            <motion.button
              aria-label={`${currentOption} filter selector`}
              whileTap={{ scale: 0.9 }}
              id={`${currentOption?.replace(" ", "-").toLowerCase()}-button`}
              className="flex-auto mx-auto border py-2 rounded-xl w-full hover:border-[#F7BCB1] border-[#222] dark:border-[#f0f0f0]"
              onClick={() => {
                if (filterApplied != `${currentOption}`) {
                  dispatch(setPreviousFilter(filterApplied));
                  dispatch(setFilterApplied(`${currentOption}`));
                } else {
                  dispatch(setPreviousFilter(filterApplied));
                  dispatch(setFilterApplied("all"));
                }
              }}
            >
              {currentOption}
            </motion.button>
          </div>
        );
      })}
    </div>
  );
};
