import { motion } from "framer-motion"
import { AccountPanel } from "./AccountPanel"
import { CreateBrews } from "./CreateBrews"

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
  auxPanelExpanded,
  toggleMobileUserPanel,
  currentUserMetadata
}) => {
  const sections = {
    "create": <></>,
    "account": <AccountPanel isDark={isDark} currentUserMetadata={currentUserMetadata} />,
    "create_brews": <CreateBrews toggleMobileUserPanel={toggleMobileUserPanel} isDark={isDark} currentUserMetadata={currentUserMetadata} />
  }
  const sectionToRender = sections[`${section}`];
  const auxPanelBaseClass = "w-full mx-auto h-full overflow-y-scroll flex items-center border-y"
  return (
    <motion.div 
      //  This dynamic className string makes auxPanel transitions all pretty based on open/close
      className={auxPanelExpanded===true ? auxPanelBaseClass + " transition-[300ms] ease-linear" : auxPanelBaseClass}
      animate={auxPanelExpanded===true ? 'open' : 'closed'}
      transition={{ 
        duration: auxPanelExpanded===true ? .4 : .1, 
        type: "tween"
      }}
      variants={variants}
    >
      {sectionToRender}
    </motion.div>
  )
}