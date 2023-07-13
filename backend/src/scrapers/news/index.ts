import { firefox } from 'playwright';
import ScraperFactory from './factory';
import { publishers } from '@prisma/client';

async function main() {
  const browser = await firefox.launch();
  try {
    const factory = new ScraperFactory();

    for (const publisher of Object.values(publishers)) {
      const context = await browser.newContext();
      const page = await context.newPage();
      const scraper = factory.getScraperInstance(publisher);
      await scraper.scrapeAndSaveNews(page);
    }
  } catch {
    // Log something here with something like sentry?
  } finally {
    await browser.close();
  }
}

main();
