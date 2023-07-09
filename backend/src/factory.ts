import { ChattanooganScraper } from './scrapers/ChattanooganScraper';

/* https://medium.com/codex/factory-pattern-type-script-implementation-with-type-map-ea422f38862 */

export interface Scraper {
  // This should return a list of articles, prisma models need to be built
  scrapeArticles(): void;
}

export const ScraperFactoryOptions = {
  Chattanoogan: ChattanooganScraper,
} as const;

type Keys = keyof typeof ScraperFactoryOptions;
type Websites = (typeof ScraperFactoryOptions)[Keys];
type ExtractInstanceType<T> = T extends new () => infer R ? R : never;

export default class ScraperFactory {
  static getScraperInstance(k: Keys): ExtractInstanceType<Websites> {
    return new ScraperFactoryOptions[k]();
  }
}
