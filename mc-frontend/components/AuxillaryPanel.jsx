import { SettingsPanel } from "./SettingsPanel"
import { AccountPanel } from "./AccountPanel"
import { FiltersPanel } from "./FiltersPanel"

export const AuxillaryPanel = ({ section, isDark, currentPage, filterOptions, setFiltersApplied }) => {
    const sections = {
        "filters": FiltersPanel(filterOptions={filterOptions}, setFiltersApplied={setFiltersApplied}),
        "settings": SettingsPanel(isDark={isDark}),
        "account": AccountPanel()
    }
    const sectionToRender = sections[`${section}`];
    return (
        <div className="w-5/6 mx-auto">
            {sectionToRender}
        </div>
    )
}