import { Page } from 'playwright';
import {
  BaseScraper,
  FoundArticle,
  RelevantArticle,
  WebsiteSection,
} from '../types';
import Parser from 'rss-parser';
import { local3RssUrl } from './config';
import { parse } from 'date-fns';
import { fromToday, isRelevantArticle } from '../generalHelpers';

class Local3NewsScraper extends BaseScraper {
  async findArticles(page: Page): Promise<FoundArticle[]> {
    const found: FoundArticle[] = [];
    const p = new Parser();
    const feed = await p.parseURL(local3RssUrl);

    for (const article of feed.items) {
      const { title: headline, pubDate: publishedString, link } = article;

      const hasAllElements = headline && publishedString && link;
      if (hasAllElements) {
        const published = parse(
          publishedString,
          'EEE, dd MMM yyyy HH:mm:ss xxxx',
          new Date(),
        );

        if (fromToday(published))
          found.push({ headline, link: link, published });
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
    const local3ImageUrl =
      'https://mychattanooga-files.nyc3.digitaloceanspaces.com/local_three_logo.jpeg';

    for (const article of foundArticles) {
      await page.goto(article.link);
      const contentContainer = await page.$('#article-body');
      const content = await contentContainer?.textContent();

      if (!contentContainer || !content)
        throw new Error(
          `Error finding article content for Local 3 article: ${article.link}`,
        );

      if (isRelevantArticle(content, article.headline, section.keywords))
        relevant.push({
          ...article,
          image: local3ImageUrl,
        });
    }

    return relevant;
  }
}

export default Local3NewsScraper;
