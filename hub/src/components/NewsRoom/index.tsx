'use client'

import styles from './NewsRoom.module.scss'
import { ArticleResponseData, publisher } from '@/types'
import Article from '../Article'
import { useContext, useEffect, useRef } from 'react'
import classNames from 'classnames'
import { NewsContext } from '@/context/news.context'
import { ChevronLeftRounded } from '@mui/icons-material'
import { Typography } from '@mui/material'

interface NewsRoomProps {
  articles: ArticleResponseData[]
}

export default function NewsRoom({ articles }: NewsRoomProps) {
  // This needs to be a context variable
  const {
    state: { selectedPublisher },
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

  const renderArticles = () => {
    return publishers.map((publisher, i) => {
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
          {filteredArticles.map((article: ArticleResponseData) => (
            <Article key={article.id} isActive={isActive} {...article} />
          ))}
        </section>
      )
    })
  }

  useEffect(() => {
    scrollableRef.current?.scrollTo({ top: 0 })
  }, [selectedPublisher])

  return (
    <>
      <div
        className={styles.newsRoom}
        id="newsRoom"
        ref={scrollableRef}
        onScroll={(e) => {
          const SHADOW_CLASSNAME = 'headerShadow'
          const VISIBLE_CLASSNAME = 'visible'

          const scrollPosition = e.currentTarget.scrollTop
          const header = document.querySelector('#mobileHeader')
          const goToTop = document.querySelector('#goToTop')
          if (scrollPosition > 15) {
            header?.classList.add(SHADOW_CLASSNAME)
            goToTop?.classList.add(VISIBLE_CLASSNAME)
          } else {
            header?.classList.remove(SHADOW_CLASSNAME)
            goToTop?.classList.remove(VISIBLE_CLASSNAME)
          }
        }}
      >
        <span
          id="goToTop"
          className={styles.goToTop}
          onClick={() => {
            scrollableRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          <ChevronLeftRounded className={styles.icon} />
        </span>
        {articles.length === 0 ? (
          <Typography variant="h3" align="center">
            No articles found yet, check back later today.
          </Typography>
        ) : (
          renderArticles()
        )}
      </div>
    </>
  )
}
