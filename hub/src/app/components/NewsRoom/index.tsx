import { format } from 'date-fns'
import styles from './NewsRoom.module.scss'
import config from '@/config'
import { ArticleResponseData } from '@/app/types'

async function getArticles() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const res = await fetch(`${config.apiRoutes.url}/articles?published=${today}`)

  if (!res.ok) throw new Error('Error fetching articles.')

  return res.json()
}

export const revalidate = 300

export default async function NewsRoom() {
  const articles: ArticleResponseData[] = await getArticles()

  return (
    <div className={styles.newsRoom}>
      {articles.map((article: ArticleResponseData) => (
        <div></div>
      ))}
    </div>
  )
}
