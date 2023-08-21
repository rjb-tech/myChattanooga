import Logo from '../Logo'
import styles from './Sidebar.module.scss'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Logo />
      </div>
    </header>
  )
}
