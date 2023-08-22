import Logo from './components/Logo'
import NewsRoom from './components/NewsRoom'
import Sidebar from './components/Sidebar'
import styles from './page.module.scss'

async function getArticles() {
  const res = fetch('/api/articles')
}

export default function Home() {
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
