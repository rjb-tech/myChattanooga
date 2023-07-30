import { REGION_KEYWORDS } from '../generalInfo';
import { WebsiteSection } from '../types';

export const timesFreePressUrl = 'https://timesfreepress.com';

const localNews: WebsiteSection = {
  link: 'news/local/',
  keywords: REGION_KEYWORDS,
};

const businessNews: WebsiteSection = {
  link: 'news/business/aroundregion/',
  keywords: REGION_KEYWORDS,
};

const regionalPoliticsNews: WebsiteSection = {
  link: 'news/politics/regional/',
  keywords: REGION_KEYWORDS,
};

export const timesFreePressSections: WebsiteSection[] = [
  localNews,
  businessNews,
  regionalPoliticsNews,
];
