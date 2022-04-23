import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"

export const LeftPanel = ({ toggleMobileNav, isDark }) => {
    const iconColor = isDark === true ? "#FFF" : "#222"
    return (
        <div className="flex w-1/4 md:w-1/12 flex-auto">
            <motion.button 
                    className="sm:hidden flex-auto pt-3" type="button" 
                    onClick={() => toggleMobileNav()}
                >
                <div className="p-6 xs:p-8">
                    {/* Put isDark trigger in the LeftPanel props and hook up to system os setting */}
                    <FontAwesomeIcon icon={faBars} style={{color: `${iconColor}`}}/>
                </div>
            </motion.button>
        </div>
    )
}