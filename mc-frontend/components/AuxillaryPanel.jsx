import { SettingsPanel } from "./SettingsPanel"
import { AccountPanel } from "./AccountPanel"
import { FiltersPanel } from "./FiltersPanel"
import 'fomantic-ui-css/semantic.min.css';

export const AuxillaryPanel = ({ section, isDark }) => {
    const sections = {
        "filters": FiltersPanel(),
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