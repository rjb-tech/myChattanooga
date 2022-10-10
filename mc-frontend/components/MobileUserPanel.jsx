import React from "react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { faFilter, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MobileAuxillaryPanel } from "./MobileAuxillaryPanel";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuxPanelExpanded } from "../redux/mainSlice";

const axios = require("axios");

const auxVariants = {
  shown: { opacity: 1, y: "-1%" },
  hidden: { opacity: 1, y: "-100%" },
};

export const MobileUserPanel = ({
  isDark,
  toggleDarkMode,
  currentPage,
  setCurrentPage,
  currentAuxSection,
  setCurrentAuxSection,
  showFilters,
  currentUserMetadata,
  // currentUserBrews,
}) => {
  const dispatch = useDispatch();
  const { auxPanelExpanded, pageContent } = useSelector((state) => state.main);
  const iconColor = isDark === true ? "#f0f0f0" : "#222";
  // const thereAreBrews = currentUserBrews.length > 0

  const { loginWithRedirect, user, isAuthenticated, isLoading } = useAuth0();
  const isAdmin = user?.email === "admin@mychattanooga.app";

  const handleAuxPanel = (incomingSection) => {
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
        setCurrentAuxSection(incomingSection);
      }
    }
  };

  useEffect(() => {
    setCurrentPage(window.location.pathname);
  }, []);

  return (
    <div className="flex-col items-center">
      <div className="items-center w-full">
        <div className="h-fit w-full divide-y-2 py-2 flex-col flex-auto text-center bg-[#f0f0f0] text-[#222] dark:bg-[#222] dark:text-[#f0f0f0] relative z-[15]">
          <div className="h-16 w-full flex justify-evenly items-center">
            {showFilters === true && (
              <motion.button
                aria-label="Article Filters"
                whileTap={{ scale: 0.85 }}
                className="bg-[#f0f0f0] dark:bg-[#222] h-2/3 rounded-full flex-1 z-10"
                onClick={() => {
                  handleAuxPanel("filters");
                }}
              >
                <FontAwesomeIcon
                  className="h-2/3 w-2/3 mx-auto"
                  icon={faFilter}
                  style={{ color: `${iconColor}` }}
                />
              </motion.button>
            )}
            {/* {(isAuthenticated && thereAreBrews) && <motion.button 
              whileTap={{ scale: 0.85 }} 
              className='bg-[#f0f0f0] dark:bg-[#222] h-2/3 rounded-full flex-1 z-10'
              onClick={() => handleAuxPanel("my_brews")}
            >
              <FontAwesomeIcon className='h-2/3 w-2/3 mx-auto' icon={faBeer} style={{color: `${iconColor}`}} />
            </motion.button>} */}
            {/* {isAuthenticated &&
            <motion.button 
              aria-label='Create Brews Release Button'
              whileTap={{ scale: 0.85 }} 
              className='bg-[#f0f0f0] dark:bg-[#222] h-2/3 rounded-full flex-1 z-10' 
              onClick={() => handleAuxPanel("create_brews")}
            >
                <FontAwesomeIcon className='h-2/3 w-2/3 mx-auto' icon={faPlusCircle} style={{color: `${iconColor}`}} />
            </motion.button>} */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              className="bg-[#f0f0f0] dark:bg-[#222] h-2/3 rounded-full flex-1 z-10"
              // onClick={() => {handleAuxPanel("account")}}
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
        </div>
      </div>
      <motion.div
        className="py-4 absolute z-[5] w-screen bg-[#f0f0f0] text-[#222] dark:bg-[#222] dark:text-[#f0f0f0] shadow overscroll-contain flex items-center"
        animate={auxPanelExpanded ? "shown" : "hidden"}
        transition={{ duration: 0.25, type: "tween" }}
        variants={auxVariants}
      >
        <MobileAuxillaryPanel
          section={currentAuxSection}
          isDark={isDark}
          currentPage={currentPage}
          auxPanelExpanded={auxPanelExpanded}
          currentUserMetadata={currentUserMetadata}
          // currentUserBrews={currentUserBrews}
        />
      </motion.div>
    </div>
  );
};
