import { ArticleResponseData, publisherNameMap } from '@/app/types'
import styles from './Article.module.scss'

import Chattanooganlogo from '../../../../public/Chattanoogan.webp'
import ChronicleLogo from '../../../../public/ChattNewsChronicle.png'
import Local3Logo from '../../../../public/Local3.jpeg'
import PulseLogo from '../../../../public/Pulse.png'
import FoxChattanoogaLogo from '../../../../public/FoxChattanoogaLogo.jpg'
import TFPLogo from '../../../../public/TimesFreePress.jpg'
import WDEFLogo from '../../../../public/WDEF.png'
import Image from 'next/image'
import Link from 'next/link'
import classNames from 'classnames'

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
  return (
    <Link
      href={link}
      target="_blank"
      className={classNames(styles.articleLink, 'visibleArticle')}
      data-publisher={publisher}
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
      </div>
    </Link>
  )
}
