import {useState, useEffect} from "react"

export const FiltersPanel = ({ filterOptions, setFilterApplied }) => {
    return (
        <div className="h-full w-full flex-col">
            {filterOptions.map((currentOption) => {
                return (
                    <div className="py-1" key={currentOption}>
                        <button 
                            className="flex-auto mx-auto border p-2 rounded-lg w-full"
                            onClick={() => console.log(setFilterApplied)}
                        >
                            {currentOption}
                        </button>
                    </div>
                )
            })}
        </div>
    )
}