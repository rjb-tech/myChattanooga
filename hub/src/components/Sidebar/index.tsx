'use client'

import { format } from 'date-fns'
import Logo from '../Logo'
import styles from './Sidebar.module.scss'
import { Email } from '@mui/icons-material'
import { useContext, useState } from 'react'
import classNames from 'classnames'
import { ArticleResponseData, publisher, publisherNameMap } from '@/types'
import { NEWS_ACTIONS, NewsContext } from '@/context/news.context'
import NewsletterSubscribeModal from '../NewsletterSubscribeModal'
import { ClickAwayListener } from '@mui/material'

interface SidebarProps {
  articles: ArticleResponseData[]
}

export default function Sidebar({ articles }: SidebarProps) {
  const {
    dispatch,
    state: { selectedPublisher },
  } = useContext(NewsContext)

  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const publishers = Array.from(
    new Set(articles.map((article) => article.publisher)),
  ).sort()

  const onPublisherClick = (incoming: publisher) => {
    if (incoming === selectedPublisher) {
      dispatch({ type: NEWS_ACTIONS.CHANGE_PUBLISHER, publisher: 'all' })
      return
    }

    dispatch({ type: NEWS_ACTIONS.CHANGE_PUBLISHER, publisher: incoming })
    return
  }

  return (
    <ClickAwayListener onClickAway={() => setModalOpen(false)}>
      <section className={styles.sidebar}>
        <NewsletterSubscribeModal open={modalOpen} setOpen={setModalOpen} />
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
                  selectedPublisher === publisher
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
        <div
          className={styles.newsletterSignup}
          onClick={() => setModalOpen(true)}
        >
          <Email />
          {selectedPublisher}
        </div>
      </section>
    </ClickAwayListener>
  )
}
