import { ChattanooganScraper } from "./scrapers/ChattanooganScraper";

export interface Scraper {
  // This should return a list of articles, prisma models need to be built
  scrapeArticles(): void;
}

class ScraperFactory {
  static getScraperInstance(siteName: string) {
    switch (siteName) {
      case "chattanoogan":
        return new ChattanooganScraper();
      default:
        return null;
    }
  }
}
