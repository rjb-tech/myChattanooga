import { motion } from "framer-motion";
import { useEffect } from "react";

export const FiltersPanel = ({
    currentPage,
    filterOptions,
    filterApplied,
    setFilterApplied
}) => {
    useEffect(() => {
        setFilterApplied("all")
    }, [currentPage])
    return (
        <div className="h-5/6 w-4/6 md:w-5/6 md:px-0 flex-col mx-auto">
            {filterOptions.length > 0 && <div className="py-1 md:py-2">
                <motion.button whileTap={{ scale: 0.9 }}
                    aria-label="Apply All Filters Button"
                    className="flex-auto mx-auto border py-2 rounded-lg md:rounded-full w-full hover:border-[#F7BCB1]"
                    onClick={() => {
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
                            className="flex-auto mx-auto border py-2 rounded-lg md:rounded-full w-full hover:border-[#F7BCB1]"
                            onClick={() => {
                                if (filterApplied != `${currentOption}`) {
                                    setFilterApplied(`${currentOption}`);
                                }
                                else {
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