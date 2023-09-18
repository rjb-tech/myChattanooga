'use client'

import { EmailRounded, Settings } from '@mui/icons-material'
import { useContext } from 'react'
import { NEWS_ACTIONS, NewsContext } from '@/context/news.context'
import Logo from '../Logo'
import styles from './MobileHeader.module.scss'

export default function MobileHeader() {
  const { dispatch } = useContext(NewsContext)

  return (
    <div id="mobileHeader" className={styles.mobileHeader}>
      {/* dispatch not working */}
      <div
        className={styles.mobileMenuButton}
        onClick={() => {
          dispatch({
            type: NEWS_ACTIONS.TOGGLE_SUBSCRIBE_MODAL,
            open: true,
          })
        }}
      >
        <EmailRounded fontSize="large" />
      </div>
      <Logo />
      <span className={styles.mobileMenuButton}>
        <Settings fontSize="large" />
      </span>
    </div>
  )
}
