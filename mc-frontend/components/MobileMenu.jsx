import { useState } from 'react';
import menu from '../public/menu.svg'
import Link from 'next/link'
import Image from 'next/image'
import { animate, motion } from "framer-motion"
import { useContext } from 'react';
import MyChattanoogaContext from './MyChattanoogaProvider';

const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "100%" },
}

export const MobileMenu = ({ isExpanded }) => {  
    return (
            <motion.nav 
                className="h-full items-center" 
                animate={isExpanded ? "open" : "closed"}
                transition={{ duration: .25, type: "tween"}}
                variants={variants}
            >  
                <div className='h-fit divide-y-2 flex-col flex-auto text-center items-center bg-yellow-500'>
                    <div className='h-8'>
                        <Link href='/'>
                            <a>
                                Hi
                            </a>
                        </Link>
                    </div>
                    <div className='h-8'>
                        <Link href='/'>
                            <a>
                                Hi
                            </a>
                        </Link>
                    </div>
                    <div className='h-8'>
                        <Link href='/'>
                            <a>
                                Hi
                            </a>
                        </Link>
                    </div>
                    <div className='h-8'>
                        <Link href='/'>
                            <a>
                                Hi
                            </a>
                        </Link>
                    </div>
                </div>                
                
            </motion.nav>   
    );
};