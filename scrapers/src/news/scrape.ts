import { firefox } from 'playwright';
import ScraperFactory from './factory';
import { Publishers } from '@prisma/client';
import { captureException, init as initSentry } from '@sentry/node';
import 'dotenv/config';

initSentry({
  dsn: 'https://de875782d88948139f9af89fd16cea3f@o4505525322317824.ingest.sentry.io/4505525386674176',
  environment: process.env.DEPLOYMENT_ENV ?? 'dev',
  tracesSampleRate: 0.75,
});

async function main() {
  const browser = await firefox.launch();
  const factory = new ScraperFactory();

  try {
    const scrapers = Object.values(Publishers).map(async (p) => {
      const context = await browser.newContext({ ignoreHTTPSErrors: true });
      const page = await context.newPage();

      const scraper = factory.getScraperInstance(p);
      return scraper.scrapeAndSaveNews(page);
    });

    await Promise.allSettled(scrapers);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(e);
    captureException(`Root level scraping error:\n\n ${e}`);
  } finally {
    await browser.close();
  }
}

main();
