import { BaseScraper } from '../types';
import { Page } from 'playwright';
import { chattanooganUrl } from './config';
import { parse } from 'date-fns';
import { fromToday, isRelevantArticle } from '../generalHelpers';
import { WebsiteSection } from '../types';
import { FoundArticle, RelevantArticle } from '../types';
import Parser from 'rss-parser';

export default class ChattanooganScraper extends BaseScraper {
  async findArticles(
    page: Page,
    section: WebsiteSection,
  ): Promise<FoundArticle[]> {
    const foundArticles: FoundArticle[] = [];

    const p = new Parser();
    const feed = await p.parseURL(`${this.url}/${section.link}`);

    for (const currentArticle of feed.items) {
      const {
        title: headline,
        link,
        pubDate: publishedString,
      } = currentArticle;

      if (headline && link && publishedString) {
        const published = parse(
          // There's no parse option for EDT or EST string values so... here we are
          publishedString.replace(' EDT', '').replace(' EST', ''),
          'EEE, dd MMM yyyy HH:mm:ss',
          new Date(),
        );

        const isHttps = link.includes('https');

        if (fromToday(published))
          foundArticles.push({
            headline,
            link: isHttps ? link : link.replace('http', 'https'),
            published,
          });
      }
    }

    return foundArticles;
  }

  async getRelevantArticles(
    page: Page,
    section: WebsiteSection,
    foundArticles: FoundArticle[],
  ): Promise<RelevantArticle[]> {
    const relevantArticles: RelevantArticle[] = [];
    for (const currentArticle of foundArticles) {
      await page.goto(currentArticle.link);

      const contentSection = await page.$('.news-content');
      const articleContent = await contentSection?.textContent();
      if (articleContent) {
        const relevant = isRelevantArticle(
          articleContent,
          currentArticle.headline,
          section.keywords,
        );

        if (relevant) {
          relevantArticles.push({
            ...currentArticle,
            image:
              'https://mychattanooga-files.nyc3.digitaloceanspaces.com/chattanoogan_logo.webp',
          });
        }
      }
    }

    return relevantArticles;
  }

  getLink(potentialMatch: string | null) {
    const linkRegex = /'([^']+)'/;

    if (potentialMatch) {
      const link = potentialMatch.match(linkRegex);

      if (link) {
        return `${chattanooganUrl}${link[1]}`;
      }
    }

    return null;
  }
}
