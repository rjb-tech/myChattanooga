import NewsRoom from '../components/NewsRoom'
import Sidebar from '../components/Sidebar'
import styles from './page.module.scss'
import config from '@/config'
import MobileHeader from '@/components/MobileHeader'
import { ArticleResponseData, publisher } from '@/types'

async function getArticles() {
  // Should this be changed to eastern time to account for production servers?
  const today = new Date()
  const res = await fetch(
    `${config.apiRoutes.url}/articles?published=${today.toISOString()}`,
  )

  if (!res.ok) throw new Error('Error fetching articles.')

  return res.json()
}

export const revalidate = 300

export default async function Home() {
  const articles = await getArticles()
  const publishers: publisher[] = Array.from(
    new Set(articles.map((article: ArticleResponseData) => article.publisher)),
  )

  return (
    <div className={styles.home}>
      <Sidebar publishers={publishers} />
      <section className={styles.headquarters}>
        <MobileHeader publishers={publishers} />
        <NewsRoom articles={articles} />
      </section>
    </div>
  )
}
