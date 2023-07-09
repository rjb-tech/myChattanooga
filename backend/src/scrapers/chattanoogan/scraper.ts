import { Scraper } from '../../factory';
import { Page } from 'playwright';
import { ChattanooganSections as sections } from './info';
import { WebsiteSection } from '../../types';

export class ChattanooganScraper implements Scraper {
  scrapeArticles(page: Page): void {
    const baseUrl = 'https://www.chattanoogan.com';

    // Article model needed, maybe setup prisma first
    const allArticles = sections
      .map((section) => scrapeChattanooganSection(page, section))
      .reduce((prev, curr) => [...prev, ...curr], []);
  }
}

function scrapeChattanooganSection(
  page: Page,
  section: WebsiteSection,
): string[] {
  return ['test'];
}
