import { Socials } from "./Socials";
import { Modal, Fade } from "@mui/material";
import { motion } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react";
import { FiltersPanel } from "./FiltersPanel";
import { AuxillaryPanel } from "./AuxillaryPanel";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faMoon,
  faUser,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import {
  setAuxPanelExpanded,
  setCurrentAuxSection,
  setDatePickerModalOpen,
} from "../redux/slices/mainSlice";
import { MobileDatePicker } from "./MobileDatePicker";

const auxVariants = {
  shown: { opacity: 1, y: "20rem" },
  hidden: { opacity: 1, y: "0rem" },
};

export const UserPanel = ({ showFilters }) => {
  const dispatch = useDispatch();
  const { auxPanelExpanded, currentAuxSection, isDark, datePickerModalOpen } =
    useSelector((state) => state.main);
  const iconColor = isDark === true ? "#f0f0f0" : "#222";
  const darkModeIcon = isDark === true ? faSun : faMoon;
  // const thereAreBrews = currentUserBrews.length > 0

  const { loginWithRedirect, user, isAuthenticated, isLoading } = useAuth0();

  const handleAuxPanel = (incomingSection) => {
    if (auxPanelExpanded === false) {
      dispatch(setAuxPanelExpanded(true));
      dispatch(setCurrentAuxSection(incomingSection));
    } else {
      if (incomingSection === currentAuxSection) {
        dispatch(setAuxPanelExpanded(false));
        setTimeout(() => dispatch(setCurrentAuxSection("")), 150);
      } else {
        dispatch(setCurrentAuxSection(incomingSection));
      }
    }
  };

  const handleCalendarClick = () => {
    dispatch(setDatePickerModalOpen(!datePickerModalOpen));
  };

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
          onClick={handleCalendarClick}
        >
          <FontAwesomeIcon
            className="h-2/3 w-2/3 mx-auto"
            icon={faCalendarDays}
            style={{ color: `${iconColor}` }}
          />
        </motion.button>
        <Modal
          open={datePickerModalOpen}
          onClose={handleCalendarClick}
          closeAfterTransition
        >
          <Fade in={datePickerModalOpen}>
            <div className="w-fit mx-auto static mx-auto left-0 right-0 my-48">
              <MobileDatePicker isWeb />
            </div>
          </Fade>
        </Modal>
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
            auxPanelExpanded={auxPanelExpanded}
          />
        </div>
        {showFilters === true && (
          <div>
            <FiltersPanel />
          </div>
        )}
        <div>
          <Socials />
        </div>
      </motion.div>
    </div>
  );
};