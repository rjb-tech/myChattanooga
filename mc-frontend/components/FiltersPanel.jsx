import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const FiltersPanel = ({
  currentPage,
  filterOptions,
  filterApplied,
  setFilterApplied,
  previousFilter,
  setPreviousFilter
}) => {

  useEffect(() => {
    document.getElementById(`${previousFilter?.replace(" ", "-").toLowerCase()}-button`)?.classList.remove("ring-[#F7BCB1]", "ring-1", "border-[#F7BCB1]")
    document.getElementById(`${filterApplied?.replace(" ", "-").toLowerCase()}-button`)?.classList.add("ring-[#F7BCB1]", "ring-1", "border-[#F7BCB1]")
  }, [filterApplied])

  return (
    <div className="h-5/6 w-4/6 md:w-5/6 md:px-0 flex-col mx-auto pb-4">
      {filterOptions.length > 0 && <div className="py-1 md:py-2">
        <motion.button whileTap={{ scale: 0.9 }}
          aria-label="Apply All Filters Button"
          id='all-button'
          className="flex-auto mx-auto border py-2 rounded-lg md:rounded-full w-full hover:ring-1 hover:ring-[#F7BCB1] border-[#F7BCB1] ring-[#F7BCB1] ring-1"
          onClick={() => {
            setPreviousFilter(filterApplied)
            setFilterApplied("all");
          }}
        >
          All Publishers
        </motion.button>
      </div>}
      {filterOptions.map((currentOption) => {
        return (
          <div className="py-1 md:py-2" key={currentOption}>
            <motion.button
              aria-label={`${currentOption} filter selector`}
              whileTap={{ scale: 0.9 }}
              id={`${currentOption?.replace(" ", "-").toLowerCase()}-button`}
              className= " flex-auto mx-auto border py-2 rounded-lg md:rounded-full w-full hover:ring-1 hover:ring-[#F7BCB1]"
              onClick={() => {
                if (filterApplied != `${currentOption}`) {
                  setPreviousFilter(filterApplied)
                  setFilterApplied(`${currentOption}`);
                }
                else {
                  setPreviousFilter(filterApplied)
                  setFilterApplied("all");
                }
              }}
            >
              {currentOption}
            </motion.button>
          </div>
        )
      })}
    </div>
  )
}