import Link from 'next/link'
import { animate, motion } from "framer-motion"

const variants = {
    open: { opacity: 1, x: "-100%" },
    closed: { opacity: 0, x: "0%" },
}

export const MobileUserPanel = ({ panelExpanded }) => {  
    return (
            <motion.nav 
                className="items-center w-full shadow-xl" 
                animate={panelExpanded ? "open" : "closed"}
                transition={{ duration: .25, type: "tween"}}
                variants={variants}
            >  
                <div className='h-fit w-full divide-y-2 flex-col flex-auto text-center bg-slate-500'>
                    <div>
                        testing
                    </div>
                </div>                
                
            </motion.nav>   
    );
};