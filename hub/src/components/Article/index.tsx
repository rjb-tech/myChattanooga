import Image from 'next/image'
import Link from 'next/link'
import classNames from 'classnames'
import { addHours, differenceInMinutes } from 'date-fns'

import { ArticleResponseData, publisherNameMap } from '@/types'
import styles from './Article.module.scss'
import Chattanooganlogo from '../../../public/Chattanoogan.webp'
import ChronicleLogo from '../../../public/ChattNewsChronicle.png'
import Local3Logo from '../../../public/Local3.jpeg'
import PulseLogo from '../../../public/Pulse.png'
import FoxChattanoogaLogo from '../../../public/FoxChattanoogaLogo.jpg'
import TFPLogo from '../../../public/TimesFreePress.jpg'
import WDEFLogo from '../../../public/WDEF.png'

const publisherImageMappings = {
  Chattanoogan: Chattanooganlogo,
  ChattanoogaNewsChronicle: ChronicleLogo,
  Local3News: Local3Logo,
  ChattanoogaPulse: PulseLogo,
  FoxChattanooga: FoxChattanoogaLogo,
  TimesFreePress: TFPLogo,
  WDEF: WDEFLogo,
  all: '',
}

interface ExtendedArticleData extends ArticleResponseData {
  isActive: boolean
}

export default function Article({
  isActive,
  headline,
  link,
  published,
  publisher,
}: ExtendedArticleData) {
  const getTimePostedText = (): string | null => {
    // Add timezone offset to get a UTC representation of the time to compare
    const utcRepresentation = addHours(
      new Date(),
      new Date().getTimezoneOffset() / 60,
    )

    const minutesSince = differenceInMinutes(
      utcRepresentation,
      new Date(published),
    )

    if (minutesSince < 0) return null

    if (minutesSince < 60) return `Posted ${minutesSince} minutes ago`

    return minutesSince < 120
      ? `Posted over ${Math.trunc(minutesSince / 60)} hour ago`
      : `Posted over ${Math.trunc(minutesSince / 60)} hours ago`
  }

  const timePostedText = getTimePostedText()
  if (!timePostedText) return null

  return (
    <Link
      href={link}
      target="_blank"
      className={classNames(styles.articleLink)}
      data-testid={isActive ? 'article' : ''}
    >
      <article className={styles.article}>
        <div className={styles.imageAndPublisher}>
          <div className={styles.publisherImageContainer}>
            <Image
              className={styles.publisherImage}
              src={publisherImageMappings[publisher]}
              alt={`${publisher} logo`}
            />
          </div>
          <p className={styles.publisher}>
            &copy; {publisherNameMap[publisher]}
          </p>
        </div>
        <h3 className={styles.headline}>{headline}</h3>
        <p data-testid="time-posted" className={styles.timePosted}>
          {timePostedText}
        </p>
      </article>
    </Link>
  )
}
