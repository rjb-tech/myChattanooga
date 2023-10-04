import Image from 'next/image'
import Link from 'next/link'
import classNames from 'classnames'
import { ArticleResponseData, publisherNameMap } from '@/types'
import styles from './Article.module.scss'
import Chattanooganlogo from '../../../public/Chattanoogan.webp'
import ChronicleLogo from '../../../public/ChattNewsChronicle.png'
import Local3Logo from '../../../public/Local3.jpeg'
import PulseLogo from '../../../public/Pulse.png'
import FoxChattanoogaLogo from '../../../public/FoxChattanoogaLogo.jpg'
import TFPLogo from '../../../public/TimesFreePress.jpg'
import WDEFLogo from '../../../public/WDEF.png'
import { differenceInMinutes, format } from 'date-fns'
import { number } from 'prop-types'

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

export default function Article({
  id,
  headline,
  link,
  published,
  saved,
  publisher,
}: ArticleResponseData) {

  const getTimePostedText = () => {
    const minutesSince = differenceInMinutes(new Date(), new Date(published))

    if (minutesSince < 60)
      return `Posted ${minutesSince} Minutes Ago`

    return minutesSince < 120 ? `Posted over ${Math.trunc(minutesSince / 60)} hour ago` : `Posted over ${Math.trunc(minutesSince / 60)} hours ago`
  }

  return (
    <Link
      href={link}
      target="_blank"
      className={classNames(styles.articleLink)}
    >
      <div className={styles.article}>
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
        {/* <p className={styles.timePosted}>
          {getTimePostedText()}
        </p> */}
      </div>
    </Link>
  )
}
