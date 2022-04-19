import { useState } from 'react';
import menu from '../public/menu.svg'
import Link from 'next/link'
import Image from 'next/image'
import { animate, motion } from "framer-motion"
import { useContext } from 'react';
import MyChattanoogaContext from './MyChattanoogaProvider';
import { WeatherStation } from './WeatherStation';

const variants = {
    open: { opacity: 1, x: "100%" },
    closed: { opacity: 0, x: "0%" },
}

export const MobileNav = ({ menuExpanded }) => {  
    return (
            <motion.nav 
                className="items-center w-full shadow-xl mx-auto" 
                animate={menuExpanded ? "open" : "closed"}
                transition={{ duration: .25, type: "tween"}}
                variants={variants}
            >  
                <div className='h-fit w-full divide-y-2 flex-col flex-auto text-center bg-slate-500'>
                    <div className='h-fit mx-auto py-8 px-12'>
                        <WeatherStation />
                    </div>
                    <div className='h-8 w-full p-1'>
                        <Link href='/'>
                            <a>
                                Brews
                            </a>
                        </Link>
                    </div>
                    <div className='h-8 w-full p-1'>
                        <Link href='/'>
                            <a>
                                News
                            </a>
                        </Link>
                    </div>
                    <div className='h-8 w-full p-1'>
                        <Link href='/'>
                            <a>
                                FAQ
                            </a>
                        </Link>
                    </div>
                </div>                
                
            </motion.nav>   
    );
};