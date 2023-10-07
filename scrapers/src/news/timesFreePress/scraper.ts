import { Page } from 'playwright';
import {
  BaseScraper,
  FoundArticle,
  RelevantArticle,
  WebsiteSection,
} from '../types';
import { timesFreePressUrl } from './config';
import { JSDOM } from 'jsdom';
import axios from 'axios';
import { parse } from 'date-fns';
import { fromToday, isRelevantArticle } from '../generalHelpers';
import { utcToZonedTime } from 'date-fns-tz';

export default class TimesFreePressScraper extends BaseScraper {
  async findArticles(
    page: Page,
    section: WebsiteSection,
  ): Promise<FoundArticle[]> {
    await page.goto(`${this.url}/${section.link}`);

    const found: FoundArticle[] = [];
    const articles = await page.$$('article');
    for (const currentArticle of articles) {
      const headlineContainer = await currentArticle.$('a');
      const headline = await headlineContainer?.innerText();
      const link = await headlineContainer?.getAttribute('href');
      const published = new Date(); // dummy date since we have to go into each article to get the actual date

      if (!headline)
        throw new Error(
          `Couldn't find headline for Fox Chattanooga article: ${link}`,
        );
      if (!link)
        throw new Error(
          `Could find link href for Fox Chattanooga article: ${headline}`,
        );

      found.push({
        headline,
        link: `${timesFreePressUrl}${link}`,
        published,
      });
    }

    return found;
  }

  async getRelevantArticles(
    page: Page,
    section: WebsiteSection,
    foundArticles: FoundArticle[],
  ): Promise<RelevantArticle[]> {
    const relevantArticles: RelevantArticle[] = [];

    for (const currentArticle of foundArticles) {
      const articleResponse = await axios.get(currentArticle.link);

      const parsedArticle = new JSDOM(await articleResponse.data);
      const page = parsedArticle.window.document;
      const content = page.querySelector('.article__body')?.textContent;

      if (!content)
        throw new Error(
          `Error retrieving content for Times Free Press article: ${currentArticle.link}`,
        );

      const dateString = page
        .querySelector('.article__date')
        ?.textContent?.trim();

      if (!dateString)
        throw new Error(
          `Error retrieving date published for Times Free Press article: ${currentArticle.link}`,
        );

      // If the datestring has updated in it, then we already have it saved... most likely
      if (dateString.toLowerCase().includes('updated')) {
        continue;
      }

      const published = this.getDatePublished(dateString);

      if (!published)
        throw new Error(
          `Error parsing date string for Times Free Press article, maybe the format changed. ${currentArticle.link}`,
        );

      const zonedPublished = utcToZonedTime(published, 'America/New_York');

      if (!fromToday(zonedPublished)) continue;

      if (isRelevantArticle(content, currentArticle.headline, section.keywords))
        relevantArticles.push({
          ...currentArticle,
        });
    }

    return relevantArticles;
  }

  getDatePublished(dateString: string): Date | null {
    if (dateString.toLowerCase().includes('today')) {
      // Example: Today at 2:36 p.m.
      const splitDateString = dateString.split(' at ');

      if (splitDateString.length === 0) return null;

      const datePublished = parse(
        splitDateString[splitDateString.length - 1],
        'h:mm aaaa',
        new Date(),
      );

      return datePublished;
    }

    // Example: July 16, 2023 at 4:32 p.m.
    return parse(dateString, "MMMM d, yyyy 'at' h:mm aaaa", new Date());
  }
}
