'use client'

import styles from './NewsRoom.module.scss'
import { ArticleResponseData, publisher } from '@/types'
import Article from '../Article'
import { MutableRefObject, useContext, useEffect, useRef } from 'react'
import classNames from 'classnames'
import { NewsContext } from '@/context/news.context'

interface NewsRoomProps {
  articles: ArticleResponseData[]
}

export default function NewsRoom({ articles }: NewsRoomProps) {
  // This needs to be a context variable
  const {
    state: { selectedPublisher, subscribeModalOpen },
  } = useContext(NewsContext)
  const scrollableRef = useRef<HTMLDivElement>(null)

  const publishers: publisher[] = [
    'all',
    ...Array.from(new Set(articles.map((a) => a.publisher))).sort(),
  ]

  const getDirection = (
    publisher: publisher,
    incomingIndex: number,
    activeIndex: number,
  ) => {
    if (publisher === 'all') return styles.up

    return incomingIndex <= activeIndex ? styles.left : styles.right
  }

  return (
    <>
      <div
        className={styles.newsRoom}
        id="newsRoom"
        ref={scrollableRef}
        onScroll={(e) => {
          const scrollPosition = e.currentTarget.scrollTop
          const SHADOW_CLASSNAME = 'headerShadow'
          const el = document.querySelector('#mobileHeader')
          if (scrollPosition > 15) {
            el?.classList.add(SHADOW_CLASSNAME)
          } else {
            el?.classList.remove(SHADOW_CLASSNAME)
          }
        }}
      >
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
                getDirection(publisher, i, activeIndex),
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
