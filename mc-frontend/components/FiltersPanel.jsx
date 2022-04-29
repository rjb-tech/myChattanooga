export const FiltersPanel = ({ contentToFilter }) => {
    const filterOptions = [...new Set(contentToFilter.map((content) => content.publisher))];
    return (
        <div className="h-full w-full">
            {filterOptions[0]}
        </div>
    )
}