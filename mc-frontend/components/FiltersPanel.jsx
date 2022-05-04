import { motion } from "framer-motion";

export const FiltersPanel = ({ 
    filterOptions, 
    filterApplied, 
    setFilterApplied 
}) => {
    return (
        <div className="h-full w-full px-4 md:px-0 flex-col">
            <div className="py-1 md:py-2">
                <motion.button whileTap={{ scale: 0.9 }} className="flex-auto mx-auto border py-2 rounded-lg md:rounded-full w-full hover:border-[#F7BCB1]"
                            onClick={() => {
                                setFilterApplied("all");
                            }}
                >
                    All Local Articles
                </motion.button>
            </div>
            {filterOptions.map((currentOption) => {
                return (
                    <div className="py-1 md:py-2" key={currentOption}>
                        <motion.button 
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