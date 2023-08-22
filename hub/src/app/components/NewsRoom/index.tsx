import { format } from 'date-fns'
import styles from './NewsRoom.module.scss'

async function getArticles() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const res = await fetch(`api/articles?published=${today}`, {
    cache: 'force-cache',
  })

  if (!res.ok) throw new Error('Error fetching articles') // add error.ts boundary in parent app folder

  return res.json()
}

export default function NewsRoom() {
  // const articles = getArticles()
  return (
    <div className={styles.newsRoom}>
      <></>
    </div>
  )
}
