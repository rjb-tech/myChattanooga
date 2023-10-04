'use client'

import { format } from 'date-fns'
import Logo from '../Logo'
import styles from './Sidebar.module.scss'
import { useContext, useEffect } from 'react'
import { publisher } from '@/types'
import { NEWS_ACTIONS, NewsContext } from '@/context/news.context'
import NewsletterSubscribeModal from '../NewsletterSubscribeModal'
import Filters from '../Filters'

interface SidebarProps {
  publishers: publisher[]
}

export default function Sidebar({ publishers }: SidebarProps) {
  const { dispatch, state } = useContext(NewsContext)

  const openModal = () => {
    dispatch({
      type: NEWS_ACTIONS.TOGGLE_SUBSCRIBE_MODAL,
      open: true,
    })
  }

  const closeModal = () => {
    dispatch({
      type: NEWS_ACTIONS.TOGGLE_SUBSCRIBE_MODAL,
      open: false,
    })
  }

  useEffect(() => {
    dispatch({
      type: NEWS_ACTIONS.SET_PUBLISHER_OPTIONS,
      publishers: publishers,
    })
  }, [publishers])

  return (
    <section className={styles.sidebar}>
      <NewsletterSubscribeModal
        open={state.subscribeModalOpen}
        closeModal={closeModal}
      />
      <div className={styles.logoAndPublisherContainer}>
        <div className={styles.logoContainer}>
          <Logo />
          <p className={styles.date}>{format(new Date(), 'EEEE MMMM do')}</p>
        </div>
        <Filters publishers={publishers} />
      </div>
      {/* <div className={styles.newsletterSignup} onClick={openModal}>
        <EmailRounded />
        Newsletter
      </div> */}
    </section>
  )
}
