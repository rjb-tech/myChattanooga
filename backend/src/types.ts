export interface Scraper {
  // This should return a list of articles, prisma models need to be built
  scrapeArticles(): void;
}
