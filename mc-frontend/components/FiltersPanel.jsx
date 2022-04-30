import {useState, useEffect} from "react"

export const FiltersPanel = ({ filterOptions, setFiltersApplied }) => {
    return (
        <div className="h-full w-full overflow-y-scroll">
            {filterOptions.map((currentOption) => {
                return (
                    <div>
                        {currentOption}
                    </div>
                )
            })}
        </div>
    )
}