import { SettingsPanel } from "./SettingsPanel"
import { AccountPanel } from "./AccountPanel"
import { FiltersPanel } from "./FiltersPanel"

export const AuxillaryPanel = ({ section }) => {
    const sections = {
        "filters": FiltersPanel(),
        "settings": SettingsPanel(),
        "account": AccountPanel()
    }
    const sectionToRender = sections[`${section}`];
    return (
        <div className="w-5/6 mx-auto">
            {sectionToRender}
        </div>
    )
}