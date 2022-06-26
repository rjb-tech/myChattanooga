import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { WeatherStation } from "./WeatherStation"
import { Socials } from "./Socials"
import { UserPanel } from "./UserPanel"
import { AuxillaryPanel } from "./AuxillaryPanel"

export const LeftPanel = ({ toggleMobileNav, isDark, toggleDarkMode }) => {
    const iconColor = isDark === true ? "#FFF" : "#222"
    return (
        <div className="flex w-1/4 md:w-1/12 flex-auto h-full relative z-[100]">
            <motion.button
                aria-label="Mobile Navigation Menu"
                whileTap={{ scale: 0.8 }}
                className="sm:hidden flex-auto pt-3" type="button" 
                onClick={() => toggleMobileNav()}
            >
                <div className="p-6 xs:p-8">
                    {/* Put isDark trigger in the LeftPanel props and hook up to system os setting */}
                    <FontAwesomeIcon icon={faBars} style={{color: `${iconColor}`}}/>
                </div>
            </motion.button>
            <div className="hidden md:block w-full bg-[#FFF] text-[#222] dark:bg-[#222] dark:text-[#FFF]">
                
            </div>
        </div>
    )
}