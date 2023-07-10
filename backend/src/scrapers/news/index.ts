import { firefox } from 'playwright';
import ScraperFactory, { ScraperFactoryOptions } from './factory';

async function main() {
  const factory = new ScraperFactory();
  const browser = await firefox.launch();

  // Add CLI options here
  //   -a scrape all articles
  //   -s <source> to scrape a specific source
  //     match input to ScraperFactoryOptions values
  try {
    for (var x of Object.keys(ScraperFactoryOptions)) {
      const context = await browser.newContext();
      const page = await context.newPage();
      const scraper = factory.getScraperInstance(x);
      await scraper.scrapeArticles(page);
    }
  } finally {
    await browser.close();
  }
}

main();
