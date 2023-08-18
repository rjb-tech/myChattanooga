'use client'

import Image from 'next/image'
import { useMediaQuery } from '@mui/material'
import myChattanoogaDark from '../../../public/myChattanooga_long-dark.png'
import myChattanoogaLight from '../../../public/myChattanooga_long-light.png'

export default function Logo() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  return (
    <picture>
      <Image
        className="logo"
        src={prefersDark ? myChattanoogaLight : myChattanoogaDark}
        alt="myChattanooga Logo"
      />
    </picture>
  )
}
