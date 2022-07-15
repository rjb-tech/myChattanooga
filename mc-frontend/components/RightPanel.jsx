import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSliders } from "@fortawesome/free-solid-svg-icons"
import { WeatherStation } from "./WeatherStation"

export const RightPanel = ({ 
  toggleMobileUserPanel, 
  toggleMobileNav,
  isDark,
  currentWeatherLocation,
  setCurrentWeatherLocation,
  menuExpanded,
  panelExpanded
}) => {
  const iconColor = isDark === true ? "#FFF" : "#222"
  const userPanelAction = () => {
    if (menuExpanded===true && panelExpanded===false) {
      toggleMobileNav()
    }
    toggleMobileUserPanel()
  }
  return (
    <div className="flex w-1/4 md:w-1/12 flex-auto h-full relative z-[100]">
      <motion.button
        aria-label="Mobile User Panel"
        whileTap={{ scale: 0.9 }}
        className="sm:hidden flex-auto pt-3" type="button" 
        onClick={() => {userPanelAction()}}
      >
        <div className="p-6">
          <FontAwesomeIcon icon={faSliders} style={{color: `${iconColor}`}}/>
        </div>
      </motion.button>
      <div className="hidden md:block w-full bg-[#FFF] text-[#222] dark:bg-[#222] dark:text-[#FFF] relative z-[100]">
        <WeatherStation 
          isDark={isDark}
          currentWeatherLocation={currentWeatherLocation}
          setCurrentWeatherLocation={setCurrentWeatherLocation}
        />
      </div>
    </div>
  )
}