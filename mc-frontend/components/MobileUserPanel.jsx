import React from 'react';
import { motion } from "framer-motion"
import { useEffect } from 'react';
import { faFilter, faSun, faMoon, faUser, faPencil } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { MobileAuxillaryPanel } from './MobileAuxillaryPanel';
import { useAuth0 } from '@auth0/auth0-react';

const axios = require('axios');

const auxVariants = {
    shown: { opacity: 1, y: "-1%"},
    hidden: { opacity: 1, y: "-100%"},
}

export const MobileUserPanel = ({ 
    isDark,
    panelExpanded, 
    toggleDarkMode, 
    setAuxPanelExpanded,
    auxPanelExpanded,
    filterApplied,
    setFilterApplied,
    filterOptions,
    setFilterOptions,
    pageContent,
    currentPage,
    setCurrentPage,
    currentAuxSection,
    setCurrentAuxSection
}) => {  
    const iconColor = isDark===true ? '#FFF' : '#222'
    const darkModeIcon = isDark===true ? faSun : faMoon
    const { loginWithRedirect, user, isAuthenticated, isLoading } = useAuth0();
    function handleAuxPanel(incomingSection) {
        function setFilters(page) {
            // This isn't done, still figuring out the data.map
            if (currentPage === "/") {
                const publishers = [...new Set(pageContent.map((contentItem) => contentItem.publisher))].sort();
                setFilterOptions(publishers);
            }
            else if (currentPage === "/brews") {

            }
        }
        if (auxPanelExpanded === false) {
            if (incomingSection==="filters") {setFilters(currentPage)}
            setAuxPanelExpanded(true);
            setCurrentAuxSection(incomingSection);
        }
        else {
            if (incomingSection === currentAuxSection) {
                setAuxPanelExpanded(false);
                setTimeout(() => setCurrentAuxSection(""), 150)
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
        setCurrentPage(window.location.pathname);
    }, [])

    return (
        <div className='flex-col items-center'>
            <div 
                className="items-center w-full" 
            >
                <div className='h-fit w-full divide-y-2 py-2 flex-col flex-auto text-center bg-[#fff] text-[#222] dark:bg-[#222] dark:text-[#FFF] relative z-[15]'>
                    <div className='h-16 w-full flex justify-evenly items-center'>
                        <motion.button whileTap={{ scale: 0.85 }} className='bg-[#FFF] dark:bg-[#222] h-2/3 rounded-full flex-1 z-10' onClick={() => toggleDarkMode()}>
                            <FontAwesomeIcon className='h-2/3 w-2/3 mx-auto' icon={darkModeIcon} style={{color: `${iconColor}`}} />
                        </motion.button>
                        <motion.button 
                            whileTap={{ scale: 0.85 }} 
                            className='bg-[#FFF] dark:bg-[#222] h-2/3 rounded-full flex-1 z-10'
                            onClick={() => {handleAuxPanel("filters")}}
                        >
                            <FontAwesomeIcon className='h-2/3 w-2/3 mx-auto' icon={faFilter} style={{color: `${iconColor}`}} />
                        </motion.button>
                        {isAuthenticated &&(<motion.button 
                            whileTap={{ scale: 0.85 }} 
                            className='bg-[#FFF] dark:bg-[#222] h-2/3 rounded-full flex-1 z-10'
                            onClick={() => {handleAuxPanel("create")}}
                        >
                            <FontAwesomeIcon className='h-2/3 w-2/3 mx-auto' icon={faPencil} style={{color: `${iconColor}`}} />
                        </motion.button>)}
                        {/* <motion.button 
                            whileTap={{ scale: 0.85 }} 
                            className='bg-[#FFF] dark:bg-[#222] h-2/3 rounded-full flex-1 z-10'
                            // onClick={() => {handleAuxPanel("account")}}
                            onClick={() => isAuthenticated===false ? loginWithRedirect() : handleAuxPanel("account")}
                        >
                            <FontAwesomeIcon className='h-2/3 w-2/3 mx-auto' icon={faUser} style={{color: `${iconColor}`}} />
                        </motion.button> */}
                    </div>
                </div>                
                    
            </div>
            <motion.div
                className='h-48 absolute z-[5] w-screen bg-[#FFF] text-[#222] dark:bg-[#222] dark:text-[#FFF] shadow overscroll-contain flex items-center'
                animate={auxPanelExpanded ? "shown" : "hidden"}
                transition={{ duration: .25, type: "tween"}}
                variants={auxVariants}
            >
                <MobileAuxillaryPanel 
                    section={currentAuxSection} 
                    isDark={isDark} 
                    currentPage={currentPage} 
                    filterOptions={filterOptions}
                    filterApplied={filterApplied}
                    setFilterApplied={setFilterApplied}
                    auxPanelExpanded={auxPanelExpanded}
                />
            </motion.div>            
        </div>
    );
};