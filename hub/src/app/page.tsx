import Image from 'next/image'
import styles from './page.module.scss'
import { Button, Theme, createStyles, makeStyles } from '@mui/material'

export default function Home() {
  return (
    <div className={styles.home}>
      <section className={styles.sidePanel}>
        <span className={styles.publisherContainer}>
          {new Array(7).fill(0).map((entry, i) => (
            <div className={styles.publisher}>{`Publisher ${i + 1}`}</div>
          ))}
        </span>
      </section>
      <section className={styles.newsRoom}>
        <h1 className={styles.mainHeading}>Chattanooga News - Today's Date</h1>
      </section>
    </div>
  )
}
