'use client'

import { EmailRounded, Settings } from '@mui/icons-material'
import { useContext, useState } from 'react'
import { NEWS_ACTIONS, NewsContext } from '@/context/news.context'
import Logo from '../Logo'
import styles from './MobileHeader.module.scss'
import FiltersModal from '../FiltersModal'

export default function MobileHeader() {
  const { dispatch } = useContext(NewsContext)
  const [filtersModalOpen, setFiltersModalOpen] = useState<boolean>(false)

  return (
    <div id="mobileHeader" className={styles.mobileHeader}>
      <FiltersModal
        open={filtersModalOpen}
        closeModal={() => {
          setFiltersModalOpen(false)
        }}
      />
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
      <div
        className={styles.mobileMenuButton}
        onClick={() => {
          setFiltersModalOpen(true)
        }}
      >
        <Settings fontSize="large" />
      </div>
    </div>
  )
}
