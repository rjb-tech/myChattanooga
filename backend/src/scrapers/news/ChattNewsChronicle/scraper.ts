import { Page } from 'playwright';
import {
  BaseScraper,
  FoundArticle,
  RelevantArticle,
  WebsiteSection,
} from '../types';
import Parser from 'rss-parser';
import { chattNewsChronicleRssUrl } from './config';
import { parse } from 'date-fns';
import { fromToday, isRelevantArticle } from '../generalHelpers';
import { REGION_KEYWORDS } from '../generalInfo';

class ChattNewsChronicleScraper extends BaseScraper {
  async findArticles(page: Page): Promise<FoundArticle[]> {
    const found: FoundArticle[] = [];
    const p = new Parser();
    const feed = await p.parseURL(chattNewsChronicleRssUrl);

    for (const article of feed.items) {
      const { headline, link, pubDate: published } = article;
      const allElementsExist = headline && link && published;

      if (allElementsExist) {
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

    for (const article of foundArticles) {
      await page.goto(article.link);

      const imageContainer = await page.$('.entry-thumb');
      const content = await page.$('.td-post-content');

      if (!imageContainer)
        throw new Error(
          `Error finding image container for Chattanooga News Chronicle article: ${article.link}`,
        );

      if (!content)
        throw new Error(
          `Error finding content for Chattanooga News Chronicle article: ${article.link}`,
        );

      const articleText = await content.textContent();

      const imageLink = await imageContainer.getAttribute('src');

      if (!articleText)
        throw new Error(
          `Error parsing article content for text in Chattanooga News Chronicle article: ${article.link}`,
        );

      if (!imageLink)
        throw new Error(
          `Error getting image link for Chattanooga News Chronicle article: ${article.link}`,
        );

      if (isRelevantArticle(articleText, article.headline, REGION_KEYWORDS)) {
        relevant.push({
          headline: article.headline,
          link: article.link,
          image: imageLink,
          timePosted: article.date,
        });
      }
    }

    return relevant;
  }
}

export default ChattNewsChronicleScraper;
