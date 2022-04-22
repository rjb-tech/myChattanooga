import Image from "next/image"
import menu from '../public/menu.svg'
import { motion } from "framer-motion"
import { useContext } from "react"
import MyChattanoogaContext from "./MyChattanoogaProvider"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSliders } from "@fortawesome/free-solid-svg-icons"
import { WeatherStation } from "./WeatherStation"

export const RightPanel = ({ toggleMobileUserPanel }) => {
    return (
        <div className="flex w-1/4 md:w-1/12 flex-auto">
            <motion.button 
                    className="sm:hidden flex-auto pt-3" type="button" 
                    onClick={() => toggleMobileUserPanel()}
                >
                <div className="p-6">
                    <FontAwesomeIcon icon={faSliders} />
                </div>
            </motion.button>
            <div className="hidden md:block w-full">
                <WeatherStation />
            </div>
            
        </div>
    )
}