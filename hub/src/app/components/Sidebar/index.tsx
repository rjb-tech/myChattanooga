'use client'

import { format } from 'date-fns'
import Logo from '../Logo'
import styles from './Sidebar.module.scss'

export default function Sidebar() {
  const renderDate = () => {
    return format(new Date(), 'EEEE MMMM do')
  }

  return (
    <section className={styles.sidePanel}>
      <div className={styles.logoContainer}>
        <Logo />
        <p className={styles.date}>{format(new Date(), 'EEEE MMMM do')}</p>
      </div>
      <span className={styles.publisherContainer}>
        {new Array(7).fill(0).map((entry, i) => (
          <div key={i} className={styles.publisher}>{`Publisher ${i + 1}`}</div>
        ))}
      </span>
    </section>
  )
}
