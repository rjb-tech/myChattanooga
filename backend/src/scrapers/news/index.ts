import { firefox } from 'playwright';
import ScraperFactory, { ScraperFactoryOptions } from './factory';

async function main() {
  const factory = new ScraperFactory();
  const browser = await firefox.launch();

  // Add CLI options here
  //   -a scrape all articles
  //   -s <source> to scrape a specific source
  //     match input to ScraperFactoryOptions values
  for (var x of Object.keys(ScraperFactoryOptions)) {
    const page = await browser.newPage();
    const scraper = factory.getScraperInstance(x);
    scraper.scrapeArticles(page);
  }

  browser.close();
}

main();
