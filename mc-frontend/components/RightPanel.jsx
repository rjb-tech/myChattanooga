import { motion } from "framer-motion";
import { WeatherStation } from "./WeatherStation";
import { toggleMobileUserPanel } from "./helpers";
import { useDispatch, useSelector } from "react-redux";
import { toggleMobileNav } from "../redux/slices/mainSlice";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const RightPanel = () => {
  const dispatch = useDispatch();
  const { location } = useSelector((state) => state.weather);
  const { mobileNavExpanded, panelExpanded, auxPanelExpanded, isDark } =
    useSelector((state) => state.main);
  const iconColor = isDark === true ? "#f0f0f0" : "#222";
  const userPanelAction = () => {
    if (mobileNavExpanded === true && panelExpanded === false) {
      dispatch(toggleMobileNav());
    }
    toggleMobileUserPanel(dispatch, auxPanelExpanded, panelExpanded);
  };
  return (
    <div className="flex w-1/4 md:w-1/12 flex-auto h-full relative z-[100]">
      <motion.button
        aria-label="Mobile User Panel"
        whileTap={{ scale: 0.9 }}
        className="sm:hidden flex-auto pt-3"
        type="button"
        onClick={userPanelAction}
      >
        <div className="p-6">
          <FontAwesomeIcon icon={faSliders} style={{ color: `${iconColor}` }} />
        </div>
      </motion.button>
      <div className="hidden md:block w-full bg-[#f0f0f0] text-[#222] dark:bg-[#222] dark:text-[#f0f0f0] relative z-[100]">
        <WeatherStation isDark={isDark} currentWeatherLocation={location} />
      </div>
    </div>
  );
};
