'use client'

import styles from './NewsRoom.module.scss'
import { ArticleResponseData, publisher } from '@/types'
import Article from '../Article'
import { useContext, useEffect, useState } from 'react'
import classNames from 'classnames'
import { NewsContext } from '@/context/news.context'

interface NewsRoomProps {
  articles: ArticleResponseData[]
}

export default function NewsRoom({ articles }: NewsRoomProps) {
  // This needs to be a context variable
  const {
    state: { selectedPublisher },
  } = useContext(NewsContext)
  const publishers: publisher[] = [
    'all',
    ...Array.from(new Set(articles.map((a) => a.publisher))).sort(),
  ]

  console.log(publishers)

  return (
    <>
      <div className={styles.newsRoom} id="newsRoom">
        {publishers.map((publisher, i) => {
          const isActive = selectedPublisher === publisher
          const activeIndex = publishers.findIndex(
            (publisher) => publisher === selectedPublisher,
          )
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
                i <= activeIndex ? styles.left : styles.right,
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
