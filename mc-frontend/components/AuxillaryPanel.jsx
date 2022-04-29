import { SettingsPanel } from "./SettingsPanel"
import { AccountPanel } from "./AccountPanel"
import { FiltersPanel } from "./FiltersPanel"

export const AuxillaryPanel = ({ section, isDark, contentToFilter }) => {
    const sections = {
        "filters": FiltersPanel(contentToFilter={contentToFilter}),
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