import { publisher, publisherNameMap } from '@/types'
import styles from './Filters.module.scss'
import classNames from 'classnames'
import { useContext } from 'react'
import { NEWS_ACTIONS, NewsContext } from '@/context/news.context'

interface FiltersProps {
  publishers: publisher[]
}

export default function Filters({ publishers }: FiltersProps) {
  const { dispatch, state } = useContext(NewsContext)

  const onPublisherClick = (incoming: publisher) => {
    if (incoming === state.selectedPublisher) {
      dispatch({ type: NEWS_ACTIONS.CHANGE_PUBLISHER, publisher: 'all' })
      return
    }

    dispatch({ type: NEWS_ACTIONS.CHANGE_PUBLISHER, publisher: incoming })
    return
  }

  return (
    <div className={styles.publisherContainer}>
      {publishers.sort().map((publisher, i) => (
        <div
          key={i}
          data-testid={`${publisher}-filter-selector`}
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
  )
}
