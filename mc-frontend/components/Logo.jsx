import Image from 'next/image'
import logo from '../public/myChattanooga_long-dark.png'

export const Logo = ({ isDark }) => {
    if (isDark) {
        return (
            <div className='flex'>
                <Image src={logo} layout='fill' />
            </div>
        )
    }
    else {
        return (
            <div className='flex h-1/4 w-1/4'>
                <Image src={logo} layout='fill' />
            </div>
        )
    }

}