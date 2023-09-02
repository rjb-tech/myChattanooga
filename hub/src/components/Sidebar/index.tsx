'use client'

import { format } from 'date-fns'
import Logo from '../Logo'
import styles from './Sidebar.module.scss'
import { Email } from '@mui/icons-material'
import { useState } from 'react'
import classNames from 'classnames'
import { ArticleResponseData, publisher, publisherNameMap } from '@/types'

const SHOWN_ARTICLE_CLASSNAME = 'visibleArticleSection'

interface SidebarProps {
  articles: ArticleResponseData[]
}

export default function Sidebar({ articles }: SidebarProps) {
  const [selected, setSelected] = useState<publisher | null>(null)
  const publishers = Array.from(
    new Set(articles.map((article) => article.publisher)),
  ).sort()

  const onPublisherClick = (incoming: publisher) => {
    const showArticlesByPublisher = (publisher: publisher) => {
      const articlesToHide = document.querySelectorAll(
        `[data-publisher]:not([data-publisher=${publisher}])`,
      )
      articlesToHide.forEach((article) => {
        article.classList.remove(SHOWN_ARTICLE_CLASSNAME)
      })

      const articlesToShow = document.querySelectorAll(
        `[data-publisher = ${publisher}]`,
      )
      articlesToShow.forEach((article) => {
        article.classList.add(SHOWN_ARTICLE_CLASSNAME)
      })
    }

    const showAllArticles = () => {
      const articlesToShow = document.querySelectorAll(
        `[data-publisher]:not([data-publisher=${selected}])`,
      )
      articlesToShow.forEach((article) =>
        article.classList.add(SHOWN_ARTICLE_CLASSNAME),
      )
    }

    if (incoming !== selected) {
      showArticlesByPublisher(incoming)
      setSelected(incoming)
      return
    }

    showAllArticles()
    setSelected(null)
    return
  }

  return (
    <section className={styles.sidebar}>
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
                selected === publisher ? styles.selectedPublisher : '',
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
      <div className={styles.newsletterSignup}>
        <Email />
        Subscribe
      </div>
    </section>
  )
}
