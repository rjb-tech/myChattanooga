'use client'

import { format } from 'date-fns'
import Logo from '../Logo'
import styles from './Sidebar.module.scss'
import { Email } from '@mui/icons-material'
import { useContext } from 'react'
import classNames from 'classnames'
import { ArticleResponseData, publisher, publisherNameMap } from '@/types'
import { NEWS_ACTIONS, NewsContext } from '@/context/news.context'
import NewsletterSubscribeModal from '../NewsletterSubscribeModal'
import { ClickAwayListener } from '@mui/material'

interface SidebarProps {
  articles: ArticleResponseData[]
}

export default function Sidebar({ articles }: SidebarProps) {
  const { dispatch, state } = useContext(NewsContext)

  const publishers = Array.from(
    new Set(articles.map((article) => article.publisher)),
  ).sort()

  const onPublisherClick = (incoming: publisher) => {
    if (incoming === state.selectedPublisher) {
      dispatch({ type: NEWS_ACTIONS.CHANGE_PUBLISHER, publisher: 'all' })
      return
    }

    dispatch({ type: NEWS_ACTIONS.CHANGE_PUBLISHER, publisher: incoming })
    return
  }

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

  return (
    <ClickAwayListener onClickAway={closeModal}>
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
          <div className={styles.publisherContainer}>
            {publishers.map((publisher, i) => (
              <div
                key={i}
                className={classNames(
                  styles.publisher,
                  state.selectedPublisher === publisher
                    ? styles.selectedPublisher
                    : '',
                )}
                onClick={() => onPublisherClick(publisher)}
              >
                <span className={styles.publisherName}>
                  {publisherNameMap[publisher]}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.newsletterSignup} onClick={openModal}>
          <Email />
          Newsletter
        </div>
      </section>
    </ClickAwayListener>
  )
}
