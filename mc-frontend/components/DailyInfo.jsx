import Image from "next/image"
import menu from '../public/menu.svg'
import { motion } from "framer-motion"
import { useContext } from "react"
import MyChattanoogaContext from "./MyChattanoogaProvider"

export const DailyInfo = ({ toggleMenu }) => {
    return (
        <div className="flex border-slate-300 border-2 w-1/4 md:w-1/12 flex-auto">
            <motion.button 
                    className="sm:hidden flex-auto pt-3" type="button" 
                    onClick={() => toggleMenu()}
                >
                    <Image src={menu} height={24} width={24}/>
                </motion.button>
        </div>
    )
}