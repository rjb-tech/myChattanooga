import { Page } from 'playwright';
import { ChattanooganScraper } from './chattanoogan';

/* https://medium.com/codex/factory-pattern-type-script-implementation-with-type-map-ea422f38862 */

export interface Scraper {
  // This should return a list of articles, prisma models need to be built
  scrapeArticles(page: Page): void;
}

// Add new scrapers here
type ScraperFactoryOptions = {
  readonly [key: string]: typeof ChattanooganScraper;
};

// Add new scrapers here
export const ScraperFactoryOptions: ScraperFactoryOptions = {
  Chattanoogan: ChattanooganScraper,
} as const;

type Sites = keyof typeof ScraperFactoryOptions;
type Scrapers = (typeof ScraperFactoryOptions)[Sites];
type ExtractInstanceType<T> = T extends new () => infer R ? R : never;

export default class ScraperFactory {
  getScraperInstance(k: Sites): ExtractInstanceType<Scrapers> {
    return new ScraperFactoryOptions[k]();
  }
}
