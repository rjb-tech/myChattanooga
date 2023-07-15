import { BaseScraper } from '../types';
import { Page } from 'playwright';
import { chattanooganUrl } from './info';
import { endOfDay, parse, subDays } from 'date-fns';
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
            saved: new Date(),
          });
        }
      }
    }

    return relevantArticles;
  }

  async saveArticles(articles: RelevantArticle[]): Promise<void> {
    // Select all of today's chattanoogan articles to be able to do if exists checking outside the db
    const existingArticles = await this.prisma.articles.findMany({
      where: {
        publisher: { equals: this.publisher },
        dateSaved: {
          gt: endOfDay(subDays(new Date(), 1)),
          lte: endOfDay(new Date()),
        },
      },
    });

    for (const article of articles) {
      let alreadyExists = false;
      for (const existing of existingArticles)
        if (
          existing.headline === article.headline ||
          existing.link === article.link
        )
          alreadyExists = true;

      if (!alreadyExists)
        await this.prisma.articles.create({
          data: {
            headline: article.headline,
            link: article.link,
            timePosted: article.timePosted,
            image: article.image,
            publisher: 'Chattanoogan',
          },
        });
    }
  }

  async saveStats(numPublished: number, numRelevant: number): Promise<void> {
    const existingStat = await this.prisma.stats.findFirst({
      select: { id: true },
      where: {
        publisher: this.publisher,
        dateSaved: { gt: subDays(new Date(), 1), lte: new Date() },
      },
    });

    if (existingStat)
      await this.prisma.stats.update({
        where: {
          id: existingStat.id,
        },
        data: {
          numPublished: numPublished,
          numRelevant: numRelevant,
        },
      });
    else
      await this.prisma.stats.create({
        data: {
          publisher: this.publisher,
          numRelevant: numRelevant,
          numPublished: numPublished,
        },
      });
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
