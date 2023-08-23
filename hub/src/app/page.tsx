import Logo from './components/Logo'
import NewsRoom from './components/NewsRoom'
import Sidebar from './components/Sidebar'
import styles from './page.module.scss'

export default async function Home() {
  return (
    <div className={styles.home}>
      <section className={styles.headquarters}>
        <div className={styles.mobileLogoContainer}>
          <Logo />
        </div>
        <div className={styles.header}>
          <h1 className={styles.mainHeading}>Chattanooga News</h1>
          <p className={styles.date}>hey</p>
        </div>
        <NewsRoom />
      </section>
    </div>
  )
}
