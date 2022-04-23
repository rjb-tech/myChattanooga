import Link from 'next/link'
import { animate, motion } from "framer-motion"
import { useState } from 'react';
import { faSolid, faFilter } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const variants = {
    open: { opacity: 1, x: "-100%" },
    closed: { opacity: 0, x: "0%" },
}

export const MobileUserPanel = ({ panelExpanded, toggleDarkMode }) => {  
    const [ filtersApplied, setFiltersApplied ] = useState([])
    return (
            <motion.nav 
                className="items-center w-full shadow-xl" 
                animate={panelExpanded ? "open" : "closed"}
                transition={{ duration: .25, type: "tween"}}
                variants={variants}
            >  
                <div className='h-fit w-full divide-y-2 flex-col flex-auto text-center bg-slate-100 shadow-xl rounded-t-xl'>
                    <div className='h-24'>
                        <button className='bg-white h-2/3' onClick={() => toggleDarkMode()}>
                            <FontAwesomeIcon className='h-full' icon={faFilter} />
                        </button>
                    </div>
                </div>                
                
            </motion.nav>   
    );
};