import { SettingsPanel } from "./SettingsPanel";
import { AccountPanel } from "./AccountPanel";
import { FiltersPanel } from "./FiltersPanel";
import { motion } from "framer-motion";
import { CreateBrews } from "./CreateBrews";
import { MyBrewsJournal } from "./MyBrewsJournal";

const variants = {
  open: { opacity: 0.99 },
  closed: { opacity: 0 },
};

export const MobileAuxillaryPanel = ({
  section,
  isDark,
  currentPage,
  filterOptions,
  filterApplied,
  setFilterApplied,
  previousFilter,
  setPreviousFilter,
  auxPanelExpanded,
  currentUserMetadata,
  // currentUserBrews
}) => {
  const sections = {
    filters: (
      <FiltersPanel
        filterOptions={filterOptions}
        filterApplied={filterApplied}
        setFilterApplied={setFilterApplied}
        previousFilter={previousFilter}
        setPreviousFilter={setPreviousFilter}
      />
    ),
    settings: <SettingsPanel isDark={isDark} />,
    create_brews: (
      <CreateBrews isDark={isDark} currentUserMetadata={currentUserMetadata} />
    ),
    account: (
      <AccountPanel isDark={isDark} currentUserMetadata={currentUserMetadata} />
    ),
    my_brews: <MyBrewsJournal /*brews={currentUserBrews}*/ isDark={isDark} />,
  };

  const sectionToRender = sections[`${section}`];
  const auxPanelBaseClass =
    "w-full mx-auto h-full overflow-y-scroll flex items-center";
  return (
    <motion.div
      //  This dynamic className string makes auxPanel transitions all pretty based on open/close
      className={
        auxPanelExpanded === true
          ? auxPanelBaseClass + " transition-[300ms] ease-linear"
          : auxPanelBaseClass
      }
      animate={auxPanelExpanded === true ? "open" : "closed"}
      transition={{
        duration: auxPanelExpanded === true ? 0.25 : 0.1,
        type: "tween",
      }}
      variants={variants}
    >
      {sectionToRender}
    </motion.div>
  );
};
