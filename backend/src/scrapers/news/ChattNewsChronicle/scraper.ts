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
import { REGION_KEYWORDS } from '../generalInfo';

class ChattNewsChronicleScraper extends BaseScraper {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findArticles(
    page: Page,
    section: WebsiteSection,
  ): Promise<FoundArticle[]> {
    const found: FoundArticle[] = [];

    const p = new Parser();
    const feed = await p.parseURL(`${this.url}/${section.link}`);

    for (const article of feed.items) {
      const { headline, link, pubDate: publishedString } = article;
      const allElementsExist = headline && link && publishedString;

      if (allElementsExist) {
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

    for (const currentArticle of foundArticles) {
      await page.goto(currentArticle.link);

      const imageContainer = await page.$('.entry-thumb');
      const content = await page.$('.td-post-content');

      if (!imageContainer)
        throw new Error(
          `Error finding image container for Chattanooga News Chronicle article: ${currentArticle.link}`,
        );

      if (!content)
        throw new Error(
          `Error finding content for Chattanooga News Chronicle article: ${currentArticle.link}`,
        );

      const articleText = await content.textContent();

      const image = await imageContainer.getAttribute('src');

      if (!articleText)
        throw new Error(
          `Error parsing article content for text in Chattanooga News Chronicle article: ${currentArticle.link}`,
        );

      if (!image)
        throw new Error(
          `Error getting image link for Chattanooga News Chronicle article: ${currentArticle.link}`,
        );

      if (
        isRelevantArticle(articleText, currentArticle.headline, REGION_KEYWORDS)
      ) {
        relevant.push({
          ...currentArticle,
          image,
        });
      }
    }

    return relevant;
  }
}

export default ChattNewsChronicleScraper;
