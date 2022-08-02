import Image from 'next/image'
import logo from '../public/myChattanooga_long-dark.png'
import logo_dark from '../public/myChattanooga_long-light.png'
import Link from 'next/link'

export const Logo = ({ isDark, toggleMobileUserPanel }) => {
  const dynamicLogo = isDark===true ? logo_dark : logo
  return (
    <div className='w-2/3 sm:w-2/6 xl:w-1/4 relative z-[100]' onClick={() => toggleMobileUserPanel()}>
      <Link href="/">
        <a>
          <Image src={dynamicLogo} layout='responsive' priority alt='myChattanooga Logo' />
        </a>
      </Link>
    </div>
  )

}