import { REGION_KEYWORDS } from '../generalInfo';
import { WebsiteSection } from '../types';

export const local3Url = 'https://www.local3news.com';

const rssFeed: WebsiteSection = {
  link: 'search/?f=rss&t=article&c=local-news&l=50&s=start_time&sd=desc',
  keywords: REGION_KEYWORDS,
};

export const local3Sections: WebsiteSection[] = [rssFeed];
