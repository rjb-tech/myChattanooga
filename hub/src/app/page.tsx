import Logo from './components/Logo'
import styles from './page.module.scss'

export default function Home() {
  return (
    <div className={styles.home}>
      <section className={styles.sidePanel}>
        <div className={styles.logoContainer}>
          <Logo />
        </div>
        <span className={styles.publisherContainer}>
          {new Array(7).fill(0).map((entry, i) => (
            <div className={styles.publisher}>{`Publisher ${i + 1}`}</div>
          ))}
        </span>
      </section>
      <section className={styles.newsRoom}>
        <div className={styles.mobileLogoContainer}>
          <Logo />
        </div>
        <h1 className={styles.mainHeading}>Chattanooga News - Today's Date</h1>
      </section>
    </div>
  )
}
