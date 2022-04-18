import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"

export const LeftPanel = ({ toggleMobileNav }) => {
    return (
        <div className="flex w-1/4 md:w-1/12 flex-auto">
            <motion.button 
                    className="sm:hidden flex-auto pt-3" type="button" 
                    onClick={() => toggleMobileNav()}
                >
                <div className="p-6 xs:p-8 stroke-[#243c5a">
                    <FontAwesomeIcon icon={faBars} />
                </div>
            </motion.button>
        </div>
    )
}