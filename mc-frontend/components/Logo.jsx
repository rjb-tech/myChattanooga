import Image from 'next/image'
import logo from '../public/myChattanooga_long-dark.png'
import logo_dark from '../public/myChattanooga_long-light.png'
import Link from 'next/link'

export const Logo = ({ isDark }) => {
    const actualLogo = isDark===true ? logo_dark : logo
    return (
        <div className='w-2/3 py-1 sm:w-1/4 lg:w-1/4'>
            <Image src={actualLogo} layout='responsive' priority />
        </div>
    )

}