'use client'

import Image from 'next/image'
import styles from './Logo.module.scss'
import { useMediaQuery } from '@mui/material'
import myChattanoogaDark from '../../../../public/myChattanooga_long-dark.png'
import myChattanoogaLight from '../../../../public/myChattanooga_long-light.png'

export default function Logo() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  return (
    <picture className={styles.picture}>
      <Image
        className={styles.logo}
        src={prefersDark ? myChattanoogaLight : myChattanoogaDark}
        alt="myChattanooga Logo"
      />
    </picture>
  )
}
