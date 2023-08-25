import styles from './NewsRoom.module.scss'
import { ArticleResponseData } from '@/app/types'
import Article from '../Article'

interface NewsRoomProps {
  articles: ArticleResponseData[]
}

export default async function NewsRoom({ articles }: NewsRoomProps) {
  return (
    <div className={styles.newsRoom} id="newsRoom">
      {articles.map((article: ArticleResponseData) => (
        <Article {...article} />
      ))}
    </div>
  )
}
