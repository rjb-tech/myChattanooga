import { motion } from "framer-motion"
import { faFilter, faGear, faSun, faMoon, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FiltersPanel } from "./FiltersPanel"

export const UserPanel = ({ isDark, toggleDarkMode, filterOptions, filterApplied, setFilterApplied }) => {
    const iconColor = isDark===true ? '#FFF' : '#222'
    const darkModeIcon = isDark===true ? faSun : faMoon
    return (
        <div className='flex-auto h-fit w-4/6 divide-y-2 flex-col flex-auto text-center bg-[#FFF] text-[#222] dark:bg-[#222] dark:text-[#FFF] mx-auto z-50'>
            <div className='h-16 w-full flex justify-evenly items-start'>
                <motion.button 
                    whileTap={{ scale: 0.85 }} 
                    className='bg-[#FFF] dark:bg-[#222] h-2/3 rounded-full flex items-start flex-1 z-30' 
                    onClick={() => toggleDarkMode()}
                >
                    <FontAwesomeIcon className='h-2/3 w-2/3 mx-auto' icon={darkModeIcon} style={{color: `${iconColor}`}} />
                </motion.button>
                
                <motion.button 
                    whileTap={{ scale: 0.85 }} 
                    className='bg-[#FFF] dark:bg-[#222] h-2/3 rounded-full flex items-start flex-1 z-30'
                    // onClick={() => {handleAuxPanel("settings")}}
                >
                    <FontAwesomeIcon className='h-2/3 w-2/3 mx-auto' icon={faGear} style={{color: `${iconColor}`}} />
                </motion.button>
                <motion.button 
                    whileTap={{ scale: 0.85 }} 
                    className='bg-[#FFF] dark:bg-[#222] h-2/3 rounded-full flex items-start flex-1 z-30'
                    // onClick={() => {handleAuxPanel("account")}}
                >
                    <FontAwesomeIcon className='h-2/3 w-2/3 mx-auto' icon={faUser} style={{color: `${iconColor}`}} />
                </motion.button>
            </div>
            <FiltersPanel filterOptions={filterOptions} filterApplied={filterApplied} setFilterApplied={setFilterApplied}/>
        </div>
    )
}