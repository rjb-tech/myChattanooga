import { motion } from "framer-motion";
import { CreateBrews } from "./CreateBrews";
import { AccountPanel } from "./AccountPanel";
import { FiltersPanel } from "./FiltersPanel";
import { SettingsPanel } from "./SettingsPanel";
import { MyBrewsJournal } from "./MyBrewsJournal";

const variants = {
  open: { opacity: 0.99 },
  closed: { opacity: 0 },
};

export const MobileAuxillaryPanel = ({ section, isDark, auxPanelExpanded }) => {
  const sections = {
    filters: <FiltersPanel />,
    settings: <SettingsPanel isDark={isDark} />,
    create_brews: <CreateBrews isDark={isDark} />,
    account: <AccountPanel isDark={isDark} />,
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
