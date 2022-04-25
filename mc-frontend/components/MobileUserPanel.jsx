import Link from 'next/link'
import { animate, motion } from "framer-motion"
import { useState } from 'react';
import { faSolid, faFilter, faGear, faSun, faMoon, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
const variants = {
    open: { opacity: 1, y: "-99%" },
    closed: { opacity: 0, y: "0%" },
}

export const MobileUserPanel = ({ panelExpanded, toggleDarkMode, isDark, currentPage }) => {  
    const [ filtersApplied, setFiltersApplied ] = useState([])
    const iconColor = isDark===true ? '#FFF' : '#222'
    const darkModeIcon = isDark===true ? faSun : faMoon
    return (
            <motion.div 
                className="items-center w-full shadow-xl" 
                animate={panelExpanded ? "open" : "closed"}
                transition={{ duration: .25, type: "tween"}}
                variants={variants}
            >  
                <div className='h-fit w-full divide-y-2 flex-col flex-auto text-center shadow-xl bg-[#FFF] text-[#222] dark:bg-[#222] dark:text-[#FFF] opacity-90'>
                    <div className='h-16 w-full flex justify-evenly items-center'>
                        <motion.button whileTap={{ scale: 0.85 }} className='bg-slate-100 dark:bg-[#222] h-3/6 rounded-full shadow-xl flex-auto' onClick={() => toggleDarkMode()}>
                            <FontAwesomeIcon className='h-full w-1/2 mx-auto' icon={darkModeIcon} style={{color: `${iconColor}`}} />
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.85 }} className='bg-slate-100 dark:bg-[#222] h-3/6 rounded-full shadow-xl flex-auto'>
                            <FontAwesomeIcon className='h-full w-1/2 mx-auto' icon={faFilter} style={{color: `${iconColor}`}} />
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.85 }} className='bg-slate-100 dark:bg-[#222] h-3/6 rounded-full shadow-xl flex-auto'>
                            <FontAwesomeIcon className='h-full w-1/2 mx-auto' icon={faGear} style={{color: `${iconColor}`}} />
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.85 }} className='bg-slate-100 dark:bg-[#222] h-3/6 rounded-full shadow-xl flex-auto'>
                            <FontAwesomeIcon className='h-full w-1/2 mx-auto' icon={faUser} style={{color: `${iconColor}`}} />
                        </motion.button>
                        <line />
                    </div>
                </div>                
                
            </motion.div>   
    );
};