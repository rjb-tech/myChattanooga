import { firefox } from 'playwright';
import ScraperFactory from './factory';
import { publishers } from '@prisma/client';

async function main() {
  const factory = new ScraperFactory();
  const browser = await firefox.launch();

  // Add CLI options here
  //   -a scrape all articles
  //   -s <source> to scrape a specific source
  //     match input to ScraperFactoryOptions values
  try {
    for (const publisher of Object.values(publishers)) {
      const context = await browser.newContext();
      const page = await context.newPage();
      const scraper = factory.getScraperInstance(publisher);
      await scraper.scrapeArticles(page);
    }
  } finally {
    await browser.close();
  }
}

main();
