import { motion } from "framer-motion"
import { faFilter, faGear, faSun, faMoon, faUser, faCalendar, faPencil } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FiltersPanel } from "./FiltersPanel"
import { Socials } from "./Socials"
import { AuxillaryPanel } from "./AuxillaryPanel"
import { useAuth0 } from '@auth0/auth0-react';

const auxVariants = {
    shown: { opacity: 1, y: "10rem"},
    hidden: { opacity: 1, y: "0rem"},
}

export const UserPanel = ({ 
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
    const showFilters = (currentPage==='/' || currentPage==='/brews') ? true : false
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
    return (
        <div className='flex-auto h-fit w-5/6 flex-col flex-auto text-center bg-[#FFF] text-[#222] dark:bg-[#222] dark:text-[#FFF] mx-auto z-50'>
            <div className='h-12 w-full flex justify-evenly items-start '>
                <motion.button 
                    whileTap={{ scale: 0.85 }} 
                    className='bg-[#FFF] dark:bg-[#222] h-5/6 rounded-full flex-1 z-30' 
                    onClick={() => toggleDarkMode()}
                >
                    <FontAwesomeIcon className='h-2/3 w-2/3 mx-auto' icon={darkModeIcon} style={{color: `${iconColor}`}} />
                </motion.button>
                
                {isAuthenticated && (<motion.button 
                    whileTap={{ scale: 0.85 }} 
                    className='bg-[#FFF] dark:bg-[#222] h-5/6 rounded-full flex-1 z-30'
                    onClick={() => {handleAuxPanel("create")}}
                >
                    <FontAwesomeIcon className='h-2/3 w-2/3 mx-auto' icon={faPencil} style={{color: `${iconColor}`}} />
                </motion.button>)}
                <motion.button 
                    whileTap={{ scale: 0.85 }} 
                    className='bg-[#FFF] dark:bg-[#222] h-5/6 rounded-full flex-1 z-30'
                    onClick={() => isAuthenticated===false ? loginWithRedirect() : handleAuxPanel("account")}
                >
                    <FontAwesomeIcon className='h-2/3 w-2/3 mx-auto' icon={faUser} style={{color: `${iconColor}`}} />
                </motion.button>
            </div>
            <motion.div
                className='h-fit w-full relativ bg-[#FFF] text-[#222] dark:bg-[#222] dark:text-[#FFF] overscroll-auto flex-col items-center z-10'
                animate={auxPanelExpanded ? "shown" : "hidden"}
                transition={{ duration: .25, type: "tween"}}
                variants={auxVariants}
            >
                
                <div className="absolute -top-40 h-40 w-full flex">
                    <AuxillaryPanel 
                        section={currentAuxSection} 
                        isDark={isDark} 
                        currentPage={currentPage} 
                        filterOptions={filterOptions}
                        filterApplied={filterApplied}
                        setFilterApplied={setFilterApplied}
                        auxPanelExpanded={auxPanelExpanded}
                    />
                </div>
                {showFilters && 
                <div>
                    <FiltersPanel 
                        currentPage={currentPage} 
                        filterOptions={filterOptions} 
                        filterApplied={filterApplied} 
                        setFilterApplied={setFilterApplied}
                    />
                </div>
                }
                <div>
                    <Socials />
                </div>
            </motion.div>
        </div>
    )
}