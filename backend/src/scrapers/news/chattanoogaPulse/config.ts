import { REGION_KEYWORDS } from '../generalInfo';
import { WebsiteSection } from '../types';

export const chattanoogaPulseUrl = 'https://www.chattanooganpulse.com';

export const chattanoogaPulseRssUrl =
  'https://www.chattanoogapulse.com/local-news/index.rss';

const dummySection: WebsiteSection = {
  link: 'whocares',
  keywords: REGION_KEYWORDS,
};

export const chattanoogaPulseSections: WebsiteSection[] = [dummySection];
