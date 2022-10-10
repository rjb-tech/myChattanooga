import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import { WeatherStation } from "./WeatherStation";
import { toggleMobileNav } from "../redux/mainSlice";
import { useDispatch, useSelector } from "react-redux";

export const RightPanel = ({
  toggleMobileUserPanel,
  isDark,
  currentWeatherLocation,
  setCurrentWeatherLocation,
  panelExpanded,
}) => {
  const dispatch = useDispatch();
  const { navExpanded } = useSelector((state) => state.main);
  const iconColor = isDark === true ? "#f0f0f0" : "#222";
  const userPanelAction = () => {
    if (navExpanded === true && panelExpanded === false) {
      dispatch(toggleMobileNav());
    }
    toggleMobileUserPanel();
  };
  return (
    <div className="flex w-1/4 md:w-1/12 flex-auto h-full relative z-[100]">
      <motion.button
        aria-label="Mobile User Panel"
        whileTap={{ scale: 0.9 }}
        className="sm:hidden flex-auto pt-3"
        type="button"
        onClick={() => {
          userPanelAction();
        }}
      >
        <div className="p-6">
          <FontAwesomeIcon icon={faSliders} style={{ color: `${iconColor}` }} />
        </div>
      </motion.button>
      <div className="hidden md:block w-full bg-[#f0f0f0] text-[#222] dark:bg-[#222] dark:text-[#f0f0f0] relative z-[100]">
        <WeatherStation
          isDark={isDark}
          currentWeatherLocation={currentWeatherLocation}
          setCurrentWeatherLocation={setCurrentWeatherLocation}
        />
      </div>
    </div>
  );
};
