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
  const { state } = useContext(NewsContext)
  const publishers: publisher[] = [
    'all',
    ...Array.from(new Set(articles.map((a) => a.publisher))),
  ]

  return (
    <>
      <div className={styles.newsRoom} id="newsRoom">
        {publishers.map((publisher, i) => {
          const isActive = state.selectedPublisher === publisher
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
