import { firefox } from 'playwright';
import ScraperFactory from './factory';
import { publishers } from '@prisma/client';
import { init as initSentry } from '@sentry/node';

initSentry({
  dsn: 'https://de875782d88948139f9af89fd16cea3f@o4505525322317824.ingest.sentry.io/4505525386674176',

  tracesSampleRate: 0.75,
});

async function main() {
  const browser = await firefox.launch();
  const factory = new ScraperFactory();

  const scrapers = [];
  try {
    for (const publisher of Object.values(publishers)) {
      const context = await browser.newContext();
      const page = await context.newPage();

      const scraper = factory.getScraperInstance(publisher);
      scrapers.push(scraper.scrapeAndSaveNews(page));
    }

    await Promise.all(scrapers);
  } finally {
    await browser.close();
  }
}
main();
