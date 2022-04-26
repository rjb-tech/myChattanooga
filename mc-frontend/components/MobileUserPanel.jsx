import Link from 'next/link'
import { animate, motion } from "framer-motion"
import { useState } from 'react';
import { faSolid, faFilter, faGear, faSun, faMoon, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { AuxillaryPanel } from './AuxillaryPanel';

const mainVariants = {
    open: { opacity: 1, y: "-99%" },
    closed: { opacity: 0, y: "0%" },
}

const auxVariants = {
    shown: { opacity: .9, y: "14%", scale: 1},
    hidden: { opacity: 0, y: "50%", scale: 0},
}

export const MobileUserPanel = ({ panelExpanded, toggleDarkMode, isDark, currentPage }) => {  
    const [ filtersApplied, setFiltersApplied ] = useState([])
    const [ auxPanelExpanded, setAuxPanelExpanded ] = useState(false)
    const iconColor = isDark===true ? '#FFF' : '#222'
    const darkModeIcon = isDark===true ? faSun : faMoon
    function handleAuxPanel(section) {
        setAuxPanelExpanded(auxPanelExpanded => !auxPanelExpanded)
    }
    return (
        <div className='flex-col items-center'>
            <motion.div 
                className="items-center w-full shadow-xl" 
                animate={panelExpanded ? "open" : "closed"}
                transition={{ duration: .25, type: "tween"}}
                variants={mainVariants}
            >
                <div className='h-fit w-full divide-y-2 flex-col flex-auto text-center shadow-xl bg-[#FFF] text-[#222] dark:bg-[#222] dark:text-[#FFF] opacity-90'>
                    <div className='h-16 w-full flex justify-evenly items-center sticky bottom-0'>
                        <motion.button whileTap={{ scale: 0.85 }} className='bg-slate-100 dark:bg-[#222] h-2/3 rounded-full shadow-xl flex-initial' onClick={() => toggleDarkMode()}>
                            <FontAwesomeIcon className='h-full w-1/2 mx-auto' icon={darkModeIcon} style={{color: `${iconColor}`}} />
                        </motion.button>
                        <motion.button 
                            whileTap={{ scale: 0.85 }} 
                            className='bg-slate-100 dark:bg-[#222] h-2/3 rounded-full shadow-xl flex-initial'
                            onClick={() => {handleAuxPanel("filters")}}
                        >
                            <FontAwesomeIcon className='h-full w-1/2 mx-auto' icon={faFilter} style={{color: `${iconColor}`}} />
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.85 }} className='bg-slate-100 dark:bg-[#222] h-2/3 rounded-full shadow-xl flex-initial'>
                            <FontAwesomeIcon className='h-full w-1/2 mx-auto' icon={faGear} style={{color: `${iconColor}`}} />
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.85 }} className='bg-slate-100 dark:bg-[#222] h-2/3 rounded-full shadow-xl flex-initial'>
                            <FontAwesomeIcon className='h-full w-1/2 mx-auto' icon={faUser} style={{color: `${iconColor}`}} />
                        </motion.button>
                    </div>
                </div>                
                    
            </motion.div>
            <motion.div
                className='h-32 w-screen absolute bottom-36 bg-[#FFF] dark:bg-[#222] overscroll-auto'
                animate={auxPanelExpanded ? "shown" : "hidden"}
                transition={{ duration: .25, type: "tween"}}
                variants={auxVariants}
            >

            </motion.div>            
        </div>
    );
};