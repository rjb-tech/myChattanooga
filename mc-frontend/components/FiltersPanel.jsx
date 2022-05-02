import {useState, useEffect} from "react"

export const FiltersPanel = ({ filterOptions, setFiltersApplied }) => {
    return (
        <div className="h-full w-full flex-col">
            {filterOptions.map((currentOption) => {
                return (
                    <div className="py-1" key={currentOption}>
                        <div className="flex-auto mx-auto border p-2 rounded-lg">
                            {currentOption}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}