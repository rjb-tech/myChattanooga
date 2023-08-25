'use client'

import { format } from 'date-fns'
import Logo from '../Logo'
import styles from './Sidebar.module.scss'
import { Email } from '@mui/icons-material'
import { useState } from 'react'
import classNames from 'classnames'
import { Collapse } from '@mui/material'

export default function Sidebar() {
  const [selected, setSelected] = useState<number | null>(null)

  const onPublisherClick = (index: number) => {
    if (selected !== index) {
      setSelected(index)
      return
    }

    setSelected(null)
    return
  }
  return (
    <section className={styles.sidebar}>
      <div className={styles.logoAndPublisherContainer}>
        <div className={styles.logoContainer}>
          <Logo />
          <p className={styles.date}>{format(new Date(), 'EEEE MMMM do')}</p>
        </div>
        <div className={styles.publisherContainer}>
          {new Array(7).fill(0).map((entry, i) => (
            <div
              key={i}
              className={classNames(
                styles.publisher,
                selected === i ? styles.selectedPublisher : '',
              )}
              onClick={() => onPublisherClick(i)}
            >{`Publisher ${i + 1}`}</div>
          ))}
        </div>
      </div>
      <div className={styles.newsletterSignup}>
        <Email />
        Subscribe
      </div>
    </section>
  )
}
