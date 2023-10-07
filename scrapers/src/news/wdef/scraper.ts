import { Page } from 'playwright';
import {
  BaseScraper,
  FoundArticle,
  RelevantArticle,
  WebsiteSection,
} from '../types';
import Parser from 'rss-parser';
import { parseISO } from 'date-fns';
import { fromToday, isRelevantArticle } from '../generalHelpers';
import { utcToZonedTime } from 'date-fns-tz';

export default class WDEFScraper extends BaseScraper {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findArticles(
    page: Page,
    section: WebsiteSection,
  ): Promise<FoundArticle[]> {
    const found: FoundArticle[] = [];

    const p = new Parser();
    const feed = await p.parseURL(`${this.url}/${section.link}`);

    for (const currentArticle of feed.items) {
      const { link, title: headline, isoDate } = currentArticle;

      if (link && headline && isoDate) {
        const published = parseISO(isoDate);
        const zonedPublished = utcToZonedTime(published, "America/New_York")
        // the weatherupdate article is updated every day, we don't want that shit dirtying our data
        if (fromToday(published) && !link.includes('weatherupdate'))
          found.push({
            headline,
            link,
            published: zonedPublished,
          });
      }
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
      await page.goto(currentArticle.link);

      const article = await page.$('article');
      if (!article)
        throw new Error(
          `Couldn't find article element for WDEF article:\n\n ${currentArticle.link}`,
        );

      if (
        isRelevantArticle(
          (await article.textContent()) ?? '',
          currentArticle.headline,
          section.keywords,
        )
      )
        relevantArticles.push({
          ...currentArticle,
        });
    }

    return relevantArticles;
  }
}
