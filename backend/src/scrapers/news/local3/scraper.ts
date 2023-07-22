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

class Local3NewsScraper extends BaseScraper {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findArticles(page: Page): Promise<FoundArticle[]> {
    const found: FoundArticle[] = [];
    const p = new Parser();
    const feed = await p.parseURL(this.url);

    for (const currentArticle of feed.items) {
      const {
        title: headline,
        pubDate: publishedString,
        link,
      } = currentArticle;

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

    for (const currentArticle of foundArticles) {
      await page.goto(currentArticle.link);
      const contentContainer = await page.$('#article-body');
      const content = await contentContainer?.textContent();

      if (!contentContainer || !content)
        throw new Error(
          `Error finding article content for Local 3 article: ${currentArticle.link}`,
        );

      if (isRelevantArticle(content, currentArticle.headline, section.keywords))
        relevant.push({
          ...currentArticle,
          image: local3ImageUrl,
        });
    }

    return relevant;
  }
}

export default Local3NewsScraper;
