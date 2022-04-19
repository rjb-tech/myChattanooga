import Image from 'next/image'
import logo from '../public/myChattanooga_long-dark.png'
import logo_dark from '../public/myChattanooga_long-light.png'
import Link from 'next/link'

export const Logo = ({ isDark }) => {
    const actualLogo = isDark ? logo_dark : logo
    if (isDark) {
        return (
            <div className='w-2/3 pt-3.5 sm:w-1/4 lg:w-32 bg-orange-300 flex-auto'>
                <Image src={actualLogo} layout='responsive' priority />
            </div>
        )
        }
    else {
        return (
            <div className='w-2/3 py-1 sm:w-1/4 lg:w-1/4'>
                <Image src={actualLogo} layout='responsive' priority />
            </div>
        )
    }

}