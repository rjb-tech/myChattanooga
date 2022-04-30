import {useState, useEffect} from "react"

export const FiltersPanel = ({ filterOptions, setFiltersApplied }) => {
    return (
        <div className="h-full w-full">
            {filterOptions}
        </div>
    )
}