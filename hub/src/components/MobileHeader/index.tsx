'use client'

import {
  EmailRounded,
  Filter,
  FilterList,
  Settings,
  Sort,
} from '@mui/icons-material'
import { useContext, useState } from 'react'
import { NEWS_ACTIONS, NewsContext } from '@/context/news.context'
import Logo from '../Logo'
import styles from './MobileHeader.module.scss'
import FiltersModal from '../FiltersModal'

export default function MobileHeader() {
  const { state } = useContext(NewsContext)
  const [filtersModalOpen, setFiltersModalOpen] = useState<boolean>(false)

  return (
    <div id="mobileHeader" className={styles.mobileHeader}>
      <FiltersModal
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
      {state.publishers.length > 0 && (
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
