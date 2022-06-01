import { SettingsPanel } from "./SettingsPanel"
import { AccountPanel } from "./AccountPanel"
import { FiltersPanel } from "./FiltersPanel"
import { motion } from "framer-motion"

const variants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
}

export const MobileAuxillaryPanel = ({ 
    section, 
    isDark, 
    currentPage, 
    filterOptions,
    filterApplied,
    setFilterApplied, 
    auxPanelExpanded 
}) => {
    const sections = {
        "filters": <FiltersPanel filterOptions={filterOptions} filterApplied={filterApplied} setFilterApplied={setFilterApplied} />,
        "settings": <SettingsPanel isDark={isDark} />,
        "create": <></>,
        "account": <AccountPanel />
    }
    
    const sectionToRender = sections[`${section}`];
    const auxPanelBaseClass = "w-full mx-auto h-full overflow-y-scroll flex items-center justify-center z-10"
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