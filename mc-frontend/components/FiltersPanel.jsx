import { motion } from "framer-motion";

export const FiltersPanel = ({ 
    filterOptions, 
    filterApplied, 
    setFilterApplied 
}) => {
    return (
        <div className="h-full w-full px-4 flex-col">
            <div>
                <motion.button whileTap={{ scale: 0.9 }} className="flex-auto mx-auto border py-2 rounded-lg w-full hover:border-[#F7BCB1]"
                            onClick={() => {
                                setFilterApplied("all");
                            }}
                >
                    All Local Articles
                </motion.button>
            </div>
            {filterOptions.map((currentOption) => {
                return (
                    <div className="py-1" key={currentOption}>
                        <motion.button 
                            whileTap={{ scale: 0.9 }}
                            className="flex-auto mx-auto border py-2 rounded-lg w-full hover:border-[#F7BCB1]"
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