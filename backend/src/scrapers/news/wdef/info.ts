import { REGION_KEYWORDS } from '../generalInfo';
import { WebsiteSection } from '../types';

export const wdefUrl = 'https://wdef.com';
export const wdefRssUrl = 'https://wdef.com/feed';

const wdefSection: WebsiteSection = {
  link: 'whocares',
  keywords: REGION_KEYWORDS,
};

export const wdefSections = [wdefSection];
