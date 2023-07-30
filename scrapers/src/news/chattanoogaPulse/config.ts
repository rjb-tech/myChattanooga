import { REGION_KEYWORDS } from '../generalInfo';
import { WebsiteSection } from '../types';

export const chattanoogaPulseUrl = 'https://www.chattanoogapulse.com';

const dummySection: WebsiteSection = {
  link: 'local-news/index.rss',
  keywords: REGION_KEYWORDS,
};

export const chattanoogaPulseSections: WebsiteSection[] = [dummySection];
