import { Page } from 'playwright';
import {
  BaseScraper,
  FoundArticle,
  RelevantArticle,
  WebsiteSection,
} from '../types';
import Parser from 'rss-parser';
import { parse } from 'date-fns';
import { fromToday, isRelevantArticle } from '../generalHelpers';

export default class ChattanoogaPulseScraper extends BaseScraper {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findArticles(page: Page): Promise<FoundArticle[]> {
    const found: FoundArticle[] = [];
    const p = new Parser({
      customFields: {
        item: ['media:content'],
      },
    });

    const feed = await p.parseURL(this.url);
    for (const currentArticle of feed.items) {
      const {
        title: headline,
        link,
        pubDate: publishedString,
      } = currentArticle;

      if (headline && link && publishedString) {
        const published = parse(
          publishedString,
          'EEE, dd MMM yyyy HH:mm:ss xxxx',
          new Date(),
        );

        if (fromToday(published))
          found.push({
            headline,
            link,
            published,
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
    const relevant: RelevantArticle[] = [];

    const p = new Parser({
      customFields: {
        item: ['media:content'],
      },
    });

    const feed = await p.parseURL(this.url);
    for (const currentArticle of feed.items) {
      const image = currentArticle['media:content'].$.url;
      const {
        title: headline,
        link,
        pubDate: publishedString,
        content,
      } = currentArticle;

      const allElementsExist =
        headline && link && publishedString && content && image;

      if (allElementsExist) {
        const published = parse(
          publishedString,
          'EEE, dd MMM yyyy HH:mm:ss xxxx',
          new Date(),
        );

        const shouldSave =
          foundArticles.find(
            (x) =>
              x.headline === headline &&
              x.link === link &&
              x.published === published,
          ) &&
          isRelevantArticle(
            content.toLowerCase(),
            headline.toLowerCase(),
            section.keywords,
          );

        if (shouldSave) {
          relevant.push({
            headline,
            link,
            image,
            published,
          });
        }
      }
    }

    return relevant;
  }
}
