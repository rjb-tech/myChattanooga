'use client'

import styles from './NewsRoom.module.scss'
import { ArticleResponseData, publisher } from '@/app/types'
import Article from '../Article'
import { useState } from 'react'

interface NewsRoomProps {
  articles: ArticleResponseData[]
}

export default async function NewsRoom({ articles }: NewsRoomProps) {
  const [activePublisher, setActivePublisher] = useState<publisher>('all')
  const publishers: publisher[] = [
    'all',
    ...Array.from(new Set(articles.map((a) => a.publisher))),
  ]

  return (
    <>
      <div className={styles.newsRoom} id="newsRoom">
        {publishers.map((publisher, i) => (
          <section
            key={i}
            className={
              activePublisher === publisher
                ? styles.visibleArticles
                : styles.hiddenArticles
            }
          >
            {articles.map((article: ArticleResponseData, i) => (
              <Article key={i} {...article} />
            ))}
          </section>
        ))}
      </div>
    </>
  )
}
