import { ArticleResponseData } from '@/app/types'
import styles from './Article.module.scss'

import Chattanooganlogo from '../../../../public/Chattanoogan.webp'
import ChronicleLogo from '../../../../public/ChattNewsChronicle.png'
import Local3Logo from '../../../../public/Local3.jpeg'
import PulseLogo from '../../../../public/Pulse.png'
import FoxChattanoogaLogo from '../../../../public/FoxChattanoogaLogo.jpg'
import TFPLogo from '../../../../public/TimesFreePress.jpg'
import WDEFLogo from '../../../../public/WDEF.png'
import Image, { StaticImageData } from 'next/image'

const publisherImageMappings = {
  Chattanoogan: Chattanooganlogo,
  ChattanoogaNewsChronicle: ChronicleLogo,
  Local3News: Local3Logo,
  ChattanoogaPulse: PulseLogo,
  FoxChattanooga: FoxChattanoogaLogo,
  TimesFreePress: TFPLogo,
  WDEF: WDEFLogo,
}

const publisherNameMappings = {
  Chattanoogan: 'Chattanoogan',
  ChattanoogaNewsChronicle: 'Chattanooga News Chronicle',
  Local3News: 'Local 3 News',
  ChattanoogaPulse: 'Chattanooga Pulse',
  FoxChattanooga: 'Fox Chattanooga',
  TimesFreePress: 'Chattanooga Times Free Press',
  WDEF: 'WDEF News 12',
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
    <div className={styles.article}>
      <picture className={styles.publisherImageContainer}>
        <Image
          className={styles.publisherImage}
          src={publisherImageMappings[publisher]}
          alt={`${publisher} logo`}
        />
      </picture>
      <p>&copy; {publisherNameMappings[publisher]}</p>
      <h3>{headline}</h3>
    </div>
  )
}
