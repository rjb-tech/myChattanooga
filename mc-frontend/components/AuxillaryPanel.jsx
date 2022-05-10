import { motion } from "framer-motion"
import { SettingsPanel } from "./SettingsPanel"
import { AccountPanel } from "./AccountPanel"

const variants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
}

export const AuxillaryPanel = ({
    section, 
    isDark, 
    currentPage, 
    filterOptions,
    filterApplied,
    setFilterApplied, 
    auxPanelExpanded 
}) => {
    const sections = {
        "settings": <SettingsPanel isDark={isDark} />,
        "account": <AccountPanel />
    }
    const sectionToRender = sections[`${section}`];
    const auxPanelBaseClass = "mx-auto h-full w-full flex-auto flex items-center justify-start border-y"
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