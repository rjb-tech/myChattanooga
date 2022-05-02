import {useState, useEffect} from "react"

export const FiltersPanel = ({ filterOptions, filterApplied, setFilterApplied }) => {
    return (
        <div className="h-full w-full flex-col">
            {filterOptions.map((currentOption) => {
                return (
                    <div className="py-1" key={currentOption}>
                        <button 
                            className="flex-auto mx-auto border p-2 rounded-lg w-full"
                            onClick={() => {
                                if (filterApplied!=`${currentOption}`) {
                                    setFilterApplied(`${currentOption}`);
                                } else {
                                    setFilterApplied("");
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