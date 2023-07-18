import { BaseScraper } from '../types';
import { Page } from 'playwright';
import { chattanooganUrl } from './config';
import { parse } from 'date-fns';
import { fromToday, isRelevantArticle } from '../generalHelpers';
import { WebsiteSection } from '../types';
import { FoundArticle, RelevantArticle } from '../types';

export default class ChattanooganScraper extends BaseScraper {
  async findArticles(page: Page): Promise<FoundArticle[]> {
    const foundArticles = [];
    const table = await page.waitForSelector('table');
    const rows = await table.$$('tr');

    for (const row of rows) {
      const cells = await row.$$('td');

      if (cells.length === 2) {
        const link = this.getLink(await row.getAttribute('onClick'));

        if (link) {
          // The whitespace replacement is necessary to compare text from the web
          const d = (await cells[1].innerText()).replace(/\s/g, ' ');
          const datePublished = parse(d, 'M/d/yyyy h:mm a', new Date());

          if (fromToday(datePublished))
            foundArticles.push({
              link,
              date: datePublished,
              headline: await cells[0].innerText(),
            });
        }
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

      const contentSection = await page.$('div.news-heading + div'); // The + operator gets the next div sibling
      const articleContent = await contentSection?.textContent();
      if (articleContent) {
        const relevant = isRelevantArticle(
          articleContent,
          currentArticle.headline,
          section.keywords,
        );

        if (relevant) {
          // need to get: timePosted
          // image will be the chattanoogan logo asset link constant
          relevantArticles.push({
            headline: currentArticle.headline,
            link: currentArticle.link,
            image:
              'https://mychattanooga-files.nyc3.digitaloceanspaces.com/chattanoogan_logo.webp',
            timePosted: currentArticle.date,
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
