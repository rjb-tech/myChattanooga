import { Browser, Page, chromium } from 'playwright';
import ScraperFactory from './factory';
import { publishers } from '@prisma/client';
import { init as initSentry } from '@sentry/node';

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

initSentry({
  dsn: 'https://de875782d88948139f9af89fd16cea3f@o4505525322317824.ingest.sentry.io/4505525386674176',
  environment: process.env.DEPLOYMENT_EN ?? 'dev',
  tracesSampleRate: 0.75,
});

async function installUBlockOrigin(page: Page) {
  await page.goto(
    'https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm',
  );
  const addToChromeButtonSelector = '//*[text()="Add to Chrome"]';
  await page.waitForSelector(addToChromeButtonSelector);
  await page.click(addToChromeButtonSelector);

  const secondaryAddToChromeButtonSelector = '//*[text()="Add extension"]';
  await page.waitForSelector(secondaryAddToChromeButtonSelector);
  await page.click(secondaryAddToChromeButtonSelector);

  const addedToChromeSelector = '//*[contains(text(),"Added to Chrome")]';
  await page.waitForSelector(addedToChromeSelector);

  return true;
}

async function scrapeAllPublishers(browser: Browser, factory: ScraperFactory) {
  try {
    const scrapers = Object.values(publishers).map(async (p) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      await installUBlockOrigin(page);

      const scraper = factory.getScraperInstance(p);
      return scraper.scrapeAndSaveNews(page);
    });

    await Promise.allSettled(scrapers);
  } finally {
    await browser.close();
  }
}

async function scrapeSeparatePublisher(
  browser: Browser,
  factory: ScraperFactory,
  publisher: publishers,
) {
  const context = await browser.newContext();
  const page = await context.newPage();

  if (Object.values(publishers).includes(publisher)) {
    await factory.getScraperInstance(publisher).scrapeAndSaveNews(page);
    return;
  }

  console.log('Invalid publisher, try again.');
  return;
}

async function main() {
  const browser = await chromium.launch();
  const factory = new ScraperFactory();

  try {
    if (argv?.publisher)
      await scrapeSeparatePublisher(browser, factory, argv.publisher);
    else await scrapeAllPublishers(browser, factory);
  } finally {
    await browser.close();
  }
}

main();
