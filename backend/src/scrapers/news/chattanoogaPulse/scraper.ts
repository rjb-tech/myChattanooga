import { Page } from 'playwright';
import {
  BaseScraper,
  FoundArticle,
  RelevantArticle,
  WebsiteSection,
} from '../types';
import Parser from 'rss-parser';
import { chattanoogaPulseRssUrl } from './config';
import { parse } from 'date-fns';
import { fromToday, isRelevantArticle } from '../generalHelpers';

export default class ChattanoogaPulseScraper extends BaseScraper {
  async findArticles(page: Page): Promise<FoundArticle[]> {
    const found = [];
    const p = new Parser({
      customFields: {
        item: ['media:content'],
      },
    });

    const feed = await p.parseURL(chattanoogaPulseRssUrl);
    for (const article of feed.items) {
      const { title: headline, link, pubDate: published } = article;

      if (headline && link && published) {
        // console.log(published);

        const date = parse(
          published,
          'EEE, dd MMM yyyy HH:mm:ss xxxx',
          new Date(),
        );

        if (fromToday(date))
          found.push({
            headline,
            link,
            date,
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

    const feed = await p.parseURL(chattanoogaPulseRssUrl);
    for (const article of feed.items) {
      const image = article['media:content'].$.url;
      const { title: headline, link, pubDate: published, content } = article;
      const allElementsExist =
        headline && link && published && content && image;

      if (allElementsExist) {
        const date = parse(
          published,
          'EEE, dd MMM yyyy HH:mm:ss xxxx',
          new Date(),
        );

        const shouldSave =
          foundArticles.find(
            (x) => x.headline === headline && x.link === link && date === date,
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
            timePosted: date,
          });
        }
      }
    }

    return relevant;
  }
}
