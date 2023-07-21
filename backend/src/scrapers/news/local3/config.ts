import { REGION_KEYWORDS } from '../generalInfo';
import { WebsiteSection } from '../types';

export const local3Url = 'https://www.local3news.com/';

export const local3RssUrl =
  'https://www.local3news.com/search/?f=rss&t=article&c=local-news&l=50&s=start_time&sd=desc';

export const local3Sections: WebsiteSection[] = [
  { link: 'who cares', keywords: REGION_KEYWORDS },
];
