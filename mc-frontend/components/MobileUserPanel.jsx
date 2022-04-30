import Link from 'next/link'
import { animate, motion } from "framer-motion"
import { useState, useEffect } from 'react';
import { faFilter, faGear, faSun, faMoon, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { AuxillaryPanel } from './AuxillaryPanel';
const axios = require('axios');

const auxVariants = {
    shown: { opacity: 1, y: "-1%"},
    hidden: { opacity: 1, y: "-100%"},
}

export const MobileUserPanel = ({ 
    panelExpanded, 
    toggleDarkMode, 
    isDark, 
    setAuxPanelExpanded,
    auxPanelExpanded,
    filtersApplied,
    setFiltersApplied
}) => {  
    const [ currentAuxSection, setCurrentAuxSection ] = useState("");
    const [ currentPage, setCurrentPage ] = useState("");
    const iconColor = isDark===true ? '#FFF' : '#222'
    const darkModeIcon = isDark===true ? faSun : faMoon

    function handleAuxPanel(incomingSection) {
        function setFilters(page) {
            // Use this function to call the appropriate endpoint and gather filter options based on that
            // if page is '/' => fetch('api/articles')
            // if page is '/brews/ => fetch('api/brews')
            console.log(currentPage)
        }
        if (auxPanelExpanded === false) {
            if (incomingSection==="filters") {setFilters(currentPage)}
            setAuxPanelExpanded(true);
            setCurrentAuxSection(incomingSection);
        }
        else {
            if (incomingSection === currentAuxSection) {
                setAuxPanelExpanded(false);
                setCurrentAuxSection("");
            }
            else {
                // This may be unnecessary sometime in the future
                if (incomingSection==="filters") {setFilters(currentPage)}
                setCurrentAuxSection(incomingSection);
            }
        }
        // setAuxPanelExpanded(auxPanelExpanded => !auxPanelExpanded)
    }

    useEffect(() => {
        const windowPathname = window.location.pathname;
        setCurrentPage(windowPathname);
    }, [])

    const userPanelClassString = auxPanelExpanded===true ? 'h-fit w-full divide-y-2 py-2 flex-col flex-auto text-center bg-[#FFF] text-[#222] dark:bg-[#222] dark:text-[#FFF] z-50' 
                                                         : 'h-fit w-full divide-y-2 py-2 flex-col flex-auto text-center bg-[#FFF] text-[#222] dark:bg-[#222] dark:text-[#FFF] z-50 opacity-90'

    return (
        <div className='flex-col items-center'>
            <div 
                className="items-center w-full" 
            >
                <div className='h-fit w-full divide-y-2 py-2 flex-col flex-auto text-center bg-[#FFF] text-[#222] dark:bg-[#222] dark:text-[#FFF] z-30'>
                    <div className='h-16 w-full flex justify-evenly items-center'>
                        <motion.button whileTap={{ scale: 0.85 }} className='bg-[#FFF] dark:bg-[#222] h-2/3 rounded-full flex-1 z-30' onClick={() => toggleDarkMode()}>
                            <FontAwesomeIcon className='h-2/3 w-2/3 mx-auto' icon={darkModeIcon} style={{color: `${iconColor}`}} />
                        </motion.button>
                        <motion.button 
                            whileTap={{ scale: 0.85 }} 
                            className='bg-[#FFF] dark:bg-[#222] h-2/3 rounded-full flex-1 z-30'
                            onClick={() => {handleAuxPanel("filters")}}
                        >
                            <FontAwesomeIcon className='h-2/3 w-2/3 mx-auto' icon={faFilter} style={{color: `${iconColor}`}} />
                        </motion.button>
                        <motion.button 
                            whileTap={{ scale: 0.85 }} 
                            className='bg-[#FFF] dark:bg-[#222] h-2/3 rounded-full flex-1 z-30'
                            onClick={() => {handleAuxPanel("settings")}}
                        >
                            <FontAwesomeIcon className='h-2/3 w-2/3 mx-auto' icon={faGear} style={{color: `${iconColor}`}} />
                        </motion.button>
                        <motion.button 
                            whileTap={{ scale: 0.85 }} 
                            className='bg-[#FFF] dark:bg-[#222] h-2/3 rounded-full flex-1 z-30'
                            onClick={() => {handleAuxPanel("account")}}
                        >
                            <FontAwesomeIcon className='h-2/3 w-2/3 mx-auto' icon={faUser} style={{color: `${iconColor}`}} />
                        </motion.button>
                    </div>
                </div>                
                    
            </div>
            <motion.div
                className='h-40 w-screen absolute bg-[#FFF] text-[#222] dark:bg-[#222] dark:text-[#FFF] shadow-md overscroll-auto'
                animate={auxPanelExpanded ? "shown" : "hidden"}
                transition={{ duration: .25, type: "tween"}}
                variants={auxVariants}
            >
                <AuxillaryPanel section={currentAuxSection} isDark={isDark} currentPage={currentPage}/>
            </motion.div>            
        </div>
    );
};