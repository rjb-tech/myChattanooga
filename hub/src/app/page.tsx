import Logo from './components/Logo'
import NewsRoom from './components/NewsRoom'
import Sidebar from './components/Sidebar'
import styles from './page.module.scss'

export default async function Home() {
  return (
    <div className={styles.home}>
      <Sidebar />
      <section className={styles.headquarters}>
        <NewsRoom />
      </section>
    </div>
  )
}
