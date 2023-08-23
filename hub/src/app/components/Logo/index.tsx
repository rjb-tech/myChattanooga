'use client'

import Image from 'next/image'
import styles from './Logo.module.scss'
import { useMediaQuery } from '@mui/material'
import myChattanoogaDark from '../../../../public/myChattanooga_long-dark.png'
import myChattanoogaLight from '../../../../public/myChattanooga_long-light.png'
import { useEffect } from 'react'

export default function Logo() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

  useEffect(() => {
    const scrollFn = (e: Event) => {
      console.log(e.target)
    }
    const element = document.querySelector('#newsRoom')
    element?.addEventListener('scroll', scrollFn)

    return () => element?.removeEventListener('scroll', scrollFn)
  }, [])

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
