import Image from "next/image"
import menu from '../public/menu.svg'
import { motion } from "framer-motion"
import { useContext } from "react"
import MyChattanoogaContext from "./MyChattanoogaProvider"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSliders } from "@fortawesome/free-solid-svg-icons"
import { WeatherStation } from "./WeatherStation"

export const RightPanel = ({ toggleMobileUserPanel, isDark }) => {
    const iconColor = isDark === true ? "#FFF" : "#222"
    return (
        <div className="flex w-1/4 md:w-1/12 flex-auto">
            <motion.button 
                    className="sm:hidden flex-auto pt-3" type="button" 
                    onClick={() => toggleMobileUserPanel()}
                >
                <div className="p-6">
                    <FontAwesomeIcon icon={faSliders} style={{color: `${iconColor}`}}/>
                </div>
            </motion.button>
            <div className="hidden md:block w-full bg-[#FFF] text-[#222] dark:bg-[#222] dark:text-[#FFF]">
                <WeatherStation isDark={isDark}/>
            </div>
            
        </div>
    )
}