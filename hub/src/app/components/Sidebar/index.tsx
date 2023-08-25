'use client'

import { format } from 'date-fns'
import Logo from '../Logo'
import styles from './Sidebar.module.scss'
import { Email } from '@mui/icons-material'
import { useState } from 'react'
import classNames from 'classnames'
import { ArticleResponseData } from '@/app/types'

interface SidebarProps {
  articles: ArticleResponseData[]
}

export default function Sidebar({ articles }: SidebarProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const publishers = Array.from(
    new Set(articles.map((article) => article.publisher)),
  )

  const onPublisherClick = (index: number) => {
    if (selected !== index) {
      setSelected(index)
      return
    }

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
                selected === i ? styles.selectedPublisher : '',
              )}
              onClick={() => onPublisherClick(i)}
            >
              <span className={styles.publisherName}>{publisher}</span>
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
