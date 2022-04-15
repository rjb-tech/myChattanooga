import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSliders } from "@fortawesome/free-solid-svg-icons"

export const LeftPanel = ({ toggleMobileUserPanel }) => {
    return (
        <div className="flex w-1/4 md:w-1/12 flex-auto">
            <motion.button 
                    className="sm:hidden flex-auto pt-3" type="button" 
                    onClick={() => toggleMobileUserPanel()}
                >
                <div className="p-6 xs:p-8">
                    <FontAwesomeIcon icon={faSliders} />
                </div>
            </motion.button>
        </div>
    )
}