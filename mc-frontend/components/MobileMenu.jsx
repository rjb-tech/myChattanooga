import { useState } from 'react';
import menu from '../public/menu.svg'
import Link from 'next/link'
import Image from 'next/image'
import { animate, motion } from "framer-motion"
import { useContext } from 'react';
import MyChattanoogaContext from './MyChattanoogaProvider';

const variants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
}

export const MobileMenu = () => {
    const {isExpanded, toggleMenu} = useContext(MyChattanoogaContext);    
    return (
            <motion.nav 
                className="h-full items-center" 
                animate={isExpanded ? "open" : "closed"}
                variants={variants}
            >  
                <div className='h-16 divide-y-2 flex-col flex-auto text-center items-center'>
                    <div>
                        <Link href='/'>
                            <a>
                                MENU
                            </a>
                        </Link>
                    </div>
                </div>                
                
            </motion.nav>
        
    );
};