import {useState, useEffect} from "react"

export const FiltersPanel = ({ filterOptions, filterApplied, setFilterApplied }) => {
    return (
        <div className="h-full w-full px-4 flex-col">
            <div>
                <button className="flex-auto mx-auto border py-2 rounded-lg w-full"
                            onClick={() => {
                                setFilterApplied("all");
                            }}
                >
                    All Local Articles
                </button>
            </div>
            {filterOptions.map((currentOption) => {
                return (
                    <div className="py-1" key={currentOption}>
                        <button 
                            className="flex-auto mx-auto border py-2 rounded-lg w-full"
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
                        </button>
                    </div>
                )
            })}
        </div>
    )
}