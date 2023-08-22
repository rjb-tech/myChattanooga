import { ArticleResponseData } from '@/app/types'
import styles from './Article.module.scss'

export default function Article({
  id,
  headline,
  link,
  published,
  saved,
  publisher,
}: ArticleResponseData) {
  return (
    <div className={styles.article}>
      <h3>{headline}</h3>
    </div>
  )
}
