import Link from 'next/link'
import { animate, motion } from "framer-motion"
import { useState } from 'react';
import { faFilter, faGear, faSun, faMoon, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { AuxillaryPanel } from './AuxillaryPanel';


const auxVariants = {
    shown: { opacity: .9, y: "14%", scale: 1},
    hidden: { opacity: 0, y: "50%", scale: 0},
}

export const MobileUserPanel = ({ panelExpanded, toggleDarkMode, isDark, currentPage }) => {  
    const [ filtersApplied, setFiltersApplied ] = useState([]);
    const [ auxPanelExpanded, setAuxPanelExpanded ] = useState(false);
    const [ currentAuxSection, setCurrentAuxSection ] = useState("");
    const iconColor = isDark===true ? '#FFF' : '#222'
    const darkModeIcon = isDark===true ? faSun : faMoon
    function handleAuxPanel(incomingSection) {
        if (auxPanelExpanded === false) {
            setAuxPanelExpanded(true);
            setCurrentAuxSection(incomingSection);
        }
        else {
            if (incomingSection === currentAuxSection) {
                setAuxPanelExpanded(false);
                setCurrentAuxSection("");
            }
            else {
                setCurrentAuxSection(incomingSection);
            }
        }
        // setAuxPanelExpanded(auxPanelExpanded => !auxPanelExpanded)
    }
    return (
        <div className='flex-col items-center'>
            <div 
                className="items-center w-full" 
            >
                <div className='h-fit w-full divide-y-2 py-2 flex-col flex-auto text-center bg-[#FFF] text-[#222] dark:bg-[#222] dark:text-[#FFF] z-30'>
                    <div className='h-16 w-full flex justify-evenly items-center'>
                        <motion.button whileTap={{ scale: 0.85 }} className='bg-slate-100 dark:bg-[#222] h-2/3 rounded-full shadow-xl flex-initial z-30' onClick={() => toggleDarkMode()}>
                            <FontAwesomeIcon className='h-full w-9/12 mx-auto' icon={darkModeIcon} style={{color: `${iconColor}`}} />
                        </motion.button>
                        <motion.button 
                            whileTap={{ scale: 0.85 }} 
                            className='bg-slate-100 dark:bg-[#222] h-2/3 rounded-full shadow-xl flex-initial z-30'
                            onClick={() => {handleAuxPanel("filters")}}
                        >
                            <FontAwesomeIcon className='h-full w-9/12 mx-auto' icon={faFilter} style={{color: `${iconColor}`}} />
                        </motion.button>
                        <motion.button 
                            whileTap={{ scale: 0.85 }} 
                            className='bg-slate-100 dark:bg-[#222] h-2/3 rounded-full shadow-xl flex-initial z-30'
                            onClick={() => {handleAuxPanel("settings")}}
                        >
                            <FontAwesomeIcon className='h-full w-9/12 mx-auto' icon={faGear} style={{color: `${iconColor}`}} />
                        </motion.button>
                        <motion.button 
                            whileTap={{ scale: 0.85 }} 
                            className='bg-slate-100 dark:bg-[#222] h-2/3 rounded-full shadow-xl flex-initial z-30'
                            onClick={() => {handleAuxPanel("account")}}
                        >
                            <FontAwesomeIcon className='h-full w-9/12 mx-auto' icon={faUser} style={{color: `${iconColor}`}} />
                        </motion.button>
                    </div>
                </div>                
                    
            </div>
            <motion.div
                className='h-32 w-screen absolute bottom-36 bg-[#FFF] dark:bg-[#222] overscroll-auto'
                animate={auxPanelExpanded ? "shown" : "hidden"}
                transition={{ duration: .25, type: "tween"}}
                variants={auxVariants}
            >
                <AuxillaryPanel section={currentAuxSection}/>
            </motion.div>            
        </div>
    );
};