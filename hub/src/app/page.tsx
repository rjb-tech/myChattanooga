import { format } from 'date-fns'
import config from '../../config'
import Logo from './components/Logo'
import NewsRoom from './components/NewsRoom'
import Sidebar from './components/Sidebar'
import styles from './page.module.scss'

async function getArticles() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const res = await fetch(`${config.apiRoutes.url}/articles?published=${today}`)

  if (!res.ok) throw new Error('Error fetching articles.')

  return res.json()
}

export const revalidate = 300

export default async function Home() {
  const articles = await getArticles()

  return (
    <div className={styles.home}>
      <Sidebar />
      <section className={styles.headquarters}>
        <div className={styles.mobileLogoContainer}>
          <Logo />
        </div>
        <h1 className={styles.mainHeading}>
          Chattanooga News - Today&apos;s Date
        </h1>
        <NewsRoom />
      </section>
    </div>
  )
}
