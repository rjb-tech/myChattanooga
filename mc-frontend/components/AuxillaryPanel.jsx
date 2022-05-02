import { SettingsPanel } from "./SettingsPanel"
import { AccountPanel } from "./AccountPanel"
import { FiltersPanel } from "./FiltersPanel"
import { motion } from "framer-motion"

const variants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
}

export const AuxillaryPanel = ({ section, isDark, currentPage, filterOptions, setFiltersApplied, auxPanelExpanded }) => {
    const sections = {
        "filters": FiltersPanel(filterOptions={filterOptions}, setFiltersApplied={setFiltersApplied}),
        "settings": SettingsPanel(isDark={isDark}),
        "account": AccountPanel()
    }
    const sectionToRender = sections[`${section}`];
    const auxPanelBaseClass = "w-full mx-auto h-full px-8 overflow-y-scroll flex items-center justify-center"
    return (
        <motion.div 
            //  This dynamic className string makes auxPanel transitions all pretty based on open/close
            className={auxPanelExpanded===true ? auxPanelBaseClass + " transition-[300ms] ease-linear" : auxPanelBaseClass}
            animate={auxPanelExpanded===true ? 'open' : 'closed'}
            transition={{ 
                duration: auxPanelExpanded===true ? .25 : .1, 
                type: "tween"
            }}
            variants={variants}
        >
            {sectionToRender}
        </motion.div>
    )
}