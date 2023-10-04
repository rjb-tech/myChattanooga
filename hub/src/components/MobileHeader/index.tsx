'use client'

import { FilterList } from '@mui/icons-material'
import { useState } from 'react'
import Logo from '../Logo'
import styles from './MobileHeader.module.scss'
import FiltersModal from '../FiltersModal'
import { publisher } from '@/types'

interface MobileHeaderProps {
  publishers: publisher[]
}

export default function MobileHeader({ publishers }: MobileHeaderProps) {
  const [filtersModalOpen, setFiltersModalOpen] = useState<boolean>(false)

  return (
    <div id="mobileHeader" className={styles.mobileHeader}>
      <FiltersModal
        publishers={publishers}
        open={filtersModalOpen}
        closeModal={() => {
          setFiltersModalOpen(false)
        }}
      />
      {/* <div
        className={styles.mobileMenuButton}
        onClick={() => {
          dispatch({
            type: NEWS_ACTIONS.TOGGLE_SUBSCRIBE_MODAL,
            open: true,
          })
        }}
      >
        <EmailRounded fontSize="large" />
      </div> */}
      <Logo />
      {publishers.length > 0 && (
        <div
          className={styles.mobileMenuButton}
          onClick={() => {
            setFiltersModalOpen(true)
          }}
        >
          <FilterList fontSize="large" />
        </div>
      )}
    </div>
  )
}
