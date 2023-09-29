'use client'

import { format } from 'date-fns'
import Logo from '../Logo'
import styles from './Sidebar.module.scss'
import { useContext, useEffect } from 'react'
import { ArticleResponseData } from '@/types'
import { NEWS_ACTIONS, NewsContext } from '@/context/news.context'
import NewsletterSubscribeModal from '../NewsletterSubscribeModal'
import Filters from '../Filters'

interface SidebarProps {
  articles: ArticleResponseData[]
}

export default function Sidebar({ articles }: SidebarProps) {
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
    const publishers = Array.from(
      new Set(articles.map((article) => article.publisher)),
    ).sort()

    dispatch({
      type: NEWS_ACTIONS.SET_PUBLISHER_OPTIONS,
      publishers: publishers,
    })
  }, [articles, dispatch])

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
        <Filters publishers={state.publishers ?? []} />
      </div>
      {/* <div className={styles.newsletterSignup} onClick={openModal}>
        <EmailRounded />
        Newsletter
      </div> */}
    </section>
  )
}
