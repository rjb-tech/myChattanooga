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

export const MobileNav = ({ menuExpanded, isDark, setMenuExpanded, toggleMobileUserPanel, panelExpanded }) => {  
    return (
            <motion.nav 
                className="items-center w-full shadow-lg mx-auto bg-[#FFF] text-[#222] dark:bg-[#222] dark:text-[#FFF] rounded-b-xl"
                animate={menuExpanded ? "open" : "closed"}
                transition={{ duration: .3, type: "tween"}}
                variants={variants}
            >  
                <div className='h-fit w-full divide-y-2 flex-col flex-auto text-center'>
                    <div className='h-fit mx-auto py-6'>
                        {/* <WeatherStation  isDark={isDark}/> */}
                    </div>
                    <div className='h-12 w-full p-1 flex items-center'>
                        <Link href='/brews'>
                            <a>
                                <button className='w-screen h-5/6' onClick={() => {setMenuExpanded(false); 
                                                                                    if (panelExpanded===true) {toggleMobileUserPanel()}
                                                                                }}>
                                    Brews
                                </button>
                            </a>
                        </Link>
                    </div>
                    <div className='h-12 w-full p-1 flex items-center'>
                        <Link href='/'>
                            <a>
                                <button className='w-screen h-5/6' onClick={() => {setMenuExpanded(false); 
                                                                                    if (panelExpanded===true) {toggleMobileUserPanel()}
                                                                                }}>
                                    News
                                </button>
                            </a>
                        </Link>
                    </div>
                    <div className='h-12 w-full p-1 flex items-center'>
                        <Link href='/faq'>
                            <a>
                                <button className='w-screen h-5/6' onClick={() => {setMenuExpanded(false); 
                                                                                    if (panelExpanded===true) {toggleMobileUserPanel()}
                                                                                }}>
                                    FAQ
                                </button>
                            </a>
                        </Link>
                    </div>
                </div>                
                
            </motion.nav>   
    );
};