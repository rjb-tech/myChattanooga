'use client'

import classNames from 'classnames'
import styles from './Navigation.module.scss'
import pages from './routes'
import { useRouter, usePathname } from 'next/navigation'

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <nav className={styles.nav}>
      {pages.map((currentPage, i) => (
        <div
          key={i}
          onClick={() => router.push(currentPage.url)}
          className={classNames(
            styles.navTab,
            pathname === currentPage.url ? styles.selected : '',
          )}
        >
          {currentPage.name}
        </div>
      ))}
    </nav>
  )
}
