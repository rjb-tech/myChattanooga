import { motion } from "framer-motion";
import { faSun, faMoon, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FiltersPanel } from "./FiltersPanel";
import { Socials } from "./Socials";
import { AuxillaryPanel } from "./AuxillaryPanel";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuxPanelExpanded } from "../redux/mainSlice";

const auxVariants = {
  shown: { opacity: 1, y: "20rem" },
  hidden: { opacity: 1, y: "0rem" },
};

export const UserPanel = ({
  isDark,
  toggleDarkMode,
  filterApplied,
  setFilterApplied,
  previousFilter,
  setPreviousFilter,
  filterOptions,
  setFilterOptions,
  pageContent,
  currentPage,
  setCurrentPage,
  currentAuxSection,
  setCurrentAuxSection,
  showFilters,
  currentUserMetadata,
  // currentUserBrews,
}) => {
  const dispatch = useDispatch();
  const { auxPanelExpanded } = useSelector((state) => state.main);
  const iconColor = isDark === true ? "#f0f0f0" : "#222";
  const darkModeIcon = isDark === true ? faSun : faMoon;
  // const thereAreBrews = currentUserBrews.length > 0

  const { loginWithRedirect, user, isAuthenticated, isLoading } = useAuth0();
  function handleAuxPanel(incomingSection) {
    function setFilters(page) {
      // This isn't done, still figuring out the data.map
      if (currentPage === "/") {
        const publishers = [
          ...new Set(pageContent.map((contentItem) => contentItem.publisher)),
        ].sort();
        setFilterOptions(publishers);
      } else if (currentPage === "/brews") {
      }
    }
    if (auxPanelExpanded === false) {
      if (incomingSection === "filters") {
        setFilters(currentPage);
      }
      dispatch(setAuxPanelExpanded(true));
      setCurrentAuxSection(incomingSection);
    } else {
      if (incomingSection === currentAuxSection) {
        dispatch(setAuxPanelExpanded(false));
        setTimeout(() => setCurrentAuxSection(""), 150);
      } else {
        // This may be unnecessary sometime in the future
        if (incomingSection === "filters") {
          setFilters(currentPage);
        }
        setCurrentAuxSection(incomingSection);
      }
    }
  }
  return (
    <div className="flex-auto h-fit w-5/6 flex-col flex-auto bg-[#f0f0f0] text-[#222] dark:bg-[#222] dark:text-[#f0f0f0] mx-auto z-50">
      <div className="h-12 w-full flex justify-evenly items-start ">
        {/* <motion.button 
          whileTap={{ scale: 0.85 }} 
          className='bg-[#f0f0f0] dark:bg-[#222] h-5/6 rounded-full flex-1 z-30' 
          onClick={() => toggleDarkMode()}
        >
          <FontAwesomeIcon className='h-2/3 w-2/3 mx-auto' icon={darkModeIcon} style={{color: `${iconColor}`}} />
        </motion.button> */}

        {/* {isAuthenticated && (<motion.button 
          whileTap={{ scale: 0.85 }} 
          className='bg-[#f0f0f0] dark:bg-[#222] h-5/6 rounded-full flex-1 z-30'
          onClick={() => {handleAuxPanel("create_brews")}}
        >
          <FontAwesomeIcon className='h-2/3 w-2/3 mx-auto' icon={faPencil} style={{color: `${iconColor}`}} />
        </motion.button>)} */}
        {/* {(isAuthenticated && thereAreBrews) && 
          <motion.button 
            whileTap={{ scale: 0.85 }} 
            className='bg-[#f0f0f0] dark:bg-[#222] h-2/3 rounded-full flex-1 z-10'
            onClick={() => handleAuxPanel("my_brews")}
          >
            <FontAwesomeIcon className='h-2/3 w-2/3 mx-auto' icon={faBeer} style={{color: `${iconColor}`}} />
          </motion.button>} */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          className="bg-[#f0f0f0] dark:bg-[#222] h-5/6 rounded-full flex-1 z-30"
          onClick={() =>
            isAuthenticated === false
              ? loginWithRedirect()
              : handleAuxPanel("account")
          }
        >
          <FontAwesomeIcon
            className="h-2/3 w-2/3 mx-auto"
            icon={faUser}
            style={{ color: `${iconColor}` }}
          />
        </motion.button>
      </div>
      <motion.div
        className="h-fit w-full relative bg-[#f0f0f0] text-[#222] dark:bg-[#222] dark:text-[#f0f0f0] overscroll-auto flex-col items-center z-10"
        animate={auxPanelExpanded ? "shown" : "hidden"}
        transition={{ duration: 0.25, type: "tween" }}
        variants={auxVariants}
      >
        <div className="absolute -top-80 h-80 w-full flex pb-2">
          <AuxillaryPanel
            section={currentAuxSection}
            isDark={isDark}
            currentPage={currentPage}
            filterOptions={filterOptions}
            filterApplied={filterApplied}
            setFilterApplied={setFilterApplied}
            auxPanelExpanded={auxPanelExpanded}
            currentUserMetadata={currentUserMetadata}
          />
        </div>
        {showFilters === true && (
          <div>
            <FiltersPanel
              currentPage={currentPage}
              filterOptions={filterOptions}
              filterApplied={filterApplied}
              setFilterApplied={setFilterApplied}
              previousFilter={previousFilter}
              setPreviousFilter={setPreviousFilter}
            />
          </div>
        )}
        <div>
          <Socials />
        </div>
      </motion.div>
    </div>
  );
};
