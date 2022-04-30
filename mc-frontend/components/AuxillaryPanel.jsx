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
    return (
        <motion.div 
            //  This dynamic className string makes auxPanel transitions all pretty based on open/close
            className={auxPanelExpanded===true ? "w-5/6 mx-auto h-full transition-[350ms] ease-linear" : "w-5/6 mx-auto h-full"}
            animate={auxPanelExpanded===true ? 'open' : 'closed'}
            transition={{ 
                duration: auxPanelExpanded===true ? .3 : .1, 
                type: "tween"
            }}
            variants={variants}
        >
            {sectionToRender}
        </motion.div>
    )
}