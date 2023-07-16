import { WebsiteSection } from '../types';
import { REGION_KEYWORDS } from '../generalInfo';

const CHATTANOOGAN_HAPPENINGS_KEYWORDS = [
  'weekly road construction report',
  'mayoral',
  'city council',
  'mayor',
  'food drive',
  'closed',
  'cdot',
  'upcoming street closures',
  'cpd',
  'county commission',
];

const CHATTANOOGAN_BUSINESS_KEYWORDS = [
  'Chattanooga Chamber',
  'Gas Prices Drop',
  'New Hamilton County Business Licenses',
];

const breaking: WebsiteSection = {
  link: 'Breaking-News/List/',
  keywords: REGION_KEYWORDS,
};

const happenings: WebsiteSection = {
  link: 'Leisuretime/Happenings/List/',
  keywords: CHATTANOOGAN_HAPPENINGS_KEYWORDS,
};

const business: WebsiteSection = {
  link: 'Community/Business/List/',
  keywords: CHATTANOOGAN_BUSINESS_KEYWORDS,
};

export const ChattanooganSections: WebsiteSection[] = [
  breaking,
  happenings,
  business,
];

export const chattanooganUrl = 'https://www.chattanoogan.com';
