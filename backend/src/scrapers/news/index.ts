import { firefox } from 'playwright';
import ScraperFactory from './factory';
import { publishers } from '@prisma/client';
import { captureException, init as initSentry } from '@sentry/node';

initSentry({
  dsn: 'https://de875782d88948139f9af89fd16cea3f@o4505525322317824.ingest.sentry.io/4505525386674176',

  tracesSampleRate: 0.75,
});

async function main() {
  const browser = await firefox.launch();
  const factory = new ScraperFactory();
  try {
    for (const publisher of Object.values(publishers)) {
      try {
        const context = await browser.newContext();
        const page = await context.newPage();

        const scraper = factory.getScraperInstance(publisher);

        await scraper.scrapeAndSaveNews(page);
      } catch (e: any) {
        captureException(`Error encountered in ${publisher} scraper:\n\n ${e}`);
      }
    }
  } finally {
    await browser.close();
  }
}
main();
