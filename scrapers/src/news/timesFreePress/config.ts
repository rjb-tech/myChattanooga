import { REGION_KEYWORDS } from '../generalInfo';
import { WebsiteSection } from '../types';

export const timesFreePressUrl = 'https://timesfreepress.com';

const localNews: WebsiteSection = {
  link: 'news/local/',
  keywords: REGION_KEYWORDS,
};

export const timesFreePressSections: WebsiteSection[] = [localNews];
