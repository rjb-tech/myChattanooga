import { Scraper } from '../../factory';
import { Page } from 'playwright';
import { ChattanooganSections } from './info';

export class ChattanooganScraper implements Scraper {
  scrapeArticles(page: Page): void {
    const baseUrl = 'https://www.chattanoogan.com';
  }
}
