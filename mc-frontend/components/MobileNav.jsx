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

export const MobileNav = ({ menuExpanded, isDark }) => {  
    return (
            <motion.nav 
                className="items-center w-full shadow-lg mx-auto rounded-b-xl bg-[#FFF] text-[#222] dark:bg-[#222] dark:text-[#FFF]"
                animate={menuExpanded ? "open" : "closed"}
                transition={{ duration: .25, type: "tween"}}
                variants={variants}
            >  
                <div className='h-fit w-full divide-y-2 flex-col flex-auto text-center'>
                    <div className='h-fit mx-auto py-6'>
                        {/* <WeatherStation  isDark={isDark}/> */}
                    </div>
                    <div className='h-12 w-full p-1 flex items-center'>
                        <Link href='/'>
                            <a>
                                <div className='w-screen h-5/6'>
                                    Brews
                                </div>
                            </a>
                        </Link>
                    </div>
                    <div className='h-12 w-full p-1 flex items-center'>
                        <Link href='/'>
                            <a>
                                <div className='w-screen h-5/6'>
                                    News
                                </div>
                            </a>
                        </Link>
                    </div>
                    <div className='h-12 w-full p-1 flex items-center'>
                        <Link href='/'>
                            <a>
                                <div className='w-screen h-5/6'>
                                    FAQ
                                </div>
                            </a>
                        </Link>
                    </div>
                </div>                
                
            </motion.nav>   
    );
};