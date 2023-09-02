'use client'

import styles from './NewsRoom.module.scss'
import { ArticleResponseData, publisher } from '@/app/types'
import Article from '../Article'
import { useState } from 'react'
import classNames from 'classnames'

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
        {publishers.map((publisher, i) => {
          const isActive = activePublisher === publisher
          const filteredArticles =
            publisher === 'all'
              ? articles
              : articles.filter((article) => article.publisher === publisher)
          return (
            <section
              key={i}
              data-publisher={publisher}
              className={classNames(
                { visibleArticleSection: isActive },
                styles.publisherSection,
                styles.left,
              )}
            >
              {filteredArticles.map((article: ArticleResponseData, i) => (
                <Article key={i} {...article} />
              ))}
            </section>
          )
        })}
      </div>
    </>
  )
}
