import Image from "next/image"
import menu from '../public/menu.svg'
import { motion } from "framer-motion"
import { useContext } from "react"
import MyChattanoogaContext from "./MyChattanoogaProvider"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"

export const RightPanel = ({ toggleNav }) => {
    return (
        <div className="flex border-slate-300 border-2 w-1/4 md:w-1/12 flex-auto">
            <motion.button 
                    className="sm:hidden flex-auto pt-3" type="button" 
                    onClick={() => toggleNav()}
                >
                <div className="p-6">
                    <FontAwesomeIcon icon={faBars} />
                </div>
            </motion.button>
        </div>
    )
}