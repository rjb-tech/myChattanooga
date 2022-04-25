import Link from 'next/link'
import { animate, motion } from "framer-motion"
import { useState } from 'react';
import { faSolid, faFilter, faGear, faSun, faMoon, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
const variants = {
    open: { opacity: 1, x: "-100%" },
    closed: { opacity: 0, x: "0%" },
}

export const MobileUserPanel = ({ panelExpanded, toggleDarkMode, isDark }) => {  
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
                <div className='h-fit w-full divide-y-2 flex-col flex-auto text-center shadow-xl rounded-t-xl bg-[#FFF] text-[#222] dark:bg-[#222] dark:text-[#FFF]'>
                    <div className='h-16 flex justify-evenly items-center'>
                        <button className='bg-slate-100 dark:bg-[#1f1f1f] h-3/6 rounded-full shadow-xl' onClick={() => toggleDarkMode()}>
                            <FontAwesomeIcon className='h-full w-3/4 mx-auto' icon={darkModeIcon} style={{color: `${iconColor}`}} />
                        </button>
                        <button className='bg-slate-100 dark:bg-[#1f1f1f] h-3/6 rounded-full shadow-xl'>
                            <FontAwesomeIcon className='h-full w-3/4 mx-auto' icon={faFilter} style={{color: `${iconColor}`}} />
                        </button>
                        <button className='bg-slate-100 dark:bg-[#1f1f1f] h-3/6 rounded-full shadow-xl'>
                            <FontAwesomeIcon className='h-full w-3/4 mx-auto' icon={faGear} style={{color: `${iconColor}`}} />
                        </button>
                        <button className='bg-slate-100 dark:bg-[#1f1f1f] h-3/6 rounded-full shadow-xl'>
                            <FontAwesomeIcon className='h-full w-3/4 mx-auto' icon={faUser} style={{color: `${iconColor}`}} />
                        </button>
                    </div>
                </div>                
                
            </motion.div>   
    );
};