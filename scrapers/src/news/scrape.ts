import { chromium, firefox } from 'playwright';
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
  const browser = await chromium.launch();
  const browser2 = await firefox.launch();
  const factory = new ScraperFactory();

  try {
    const scrapers = Object.values(Publishers).map(async (p) => {
      if (p === Publishers.Local3News || p === Publishers.WDEF) {
        const context = await browser.newContext({
          ignoreHTTPSErrors: true,
          reducedMotion: 'reduce',
          timezoneId: 'America/New_York',
          locale: 'en-US',
          extraHTTPHeaders: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:91.0) Gecko/20100101 Firefox/91.0',
            // Add headers for HTTPS DNS resolution
            DNT: '1', // Do Not Track
            'Upgrade-Insecure-Requests': '1',
          },
        });
        const page = await context.newPage();

        const scraper = factory.getScraperInstance(p);
        return scraper.scrapeAndSaveNews(page);
      } else {
        const context = await browser2.newContext({
          ignoreHTTPSErrors: true,
          reducedMotion: 'reduce',
          timezoneId: 'America/New_York',
          locale: 'en-US',
          extraHTTPHeaders: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:91.0) Gecko/20100101 Firefox/91.0',
            // Add headers for HTTPS DNS resolution
            DNT: '1', // Do Not Track
            'Upgrade-Insecure-Requests': '1',
          },
        });
        const page = await context.newPage();

        const scraper = factory.getScraperInstance(p);
        return scraper.scrapeAndSaveNews(page);
      }
    });

    await Promise.allSettled(scrapers);

    // await factory
    //   .getScraperInstance(Publishers.FoxChattanooga)
    //   .scrapeAndSaveNews(await browser.newPage());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(e);
    captureException(`Root level scraping error:\n\n ${e}`);
  } finally {
    await browser.close();
  }
}

main();
