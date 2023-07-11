import { Scraper } from '../factory';
import { Page } from 'playwright';
import { chattanooganUrl, ChattanooganSections as sections } from './info';
import { parse, subDays } from 'date-fns';
import { PrismaClient } from '@prisma/client';
import { isRelevantArticle } from '../generalHelpers';
import { WebsiteSection } from '../../../types';

interface FoundArticle {
  headline: string;
  link: string;
  date: Date;
}

interface RelevantArticle {
  headline: string;
  link: string;
  image: string;
  timePosted: Date;
  saved: Date;
}

export class ChattanooganScraper implements Scraper {
  // Most of this function can probably be generalized and split into a reusable function
  // since all it's doing is calling other class methods. Maybe implement this in the base class
  // and make getIncompleteArticles and getRelevantArticleEntries class methods
  async scrapeArticles(page: Page): Promise<void> {
    const prisma = new PrismaClient();
    // Select all of today's chattanoogan articles to be able to do if exists checking outside the db
    const existingArticles = await prisma.articles.findMany({
      where: {
        publisher: { equals: 'Chattanoogan' },
        saved: { gt: subDays(new Date(), 1), lte: new Date() },
      },
    });

    const allRelevantArticles = [];
    for (var section of sections) {
      await page.goto(`${chattanooganUrl}/${section.link}`);
      const found = await getIncompleteArticles(page);
      const relevant = await getRelevantArticleEntries(page, section, found);
      allRelevantArticles.push(...relevant); // filter articles here against existing articles instead of having a large iteration below
    }

    for (var article of allRelevantArticles) {
      var alreadyExists = false;
      for (var existing of existingArticles)
        if (
          existing.headline === article.headline ||
          existing.link === article.link
        )
          alreadyExists = true;

      if (!alreadyExists)
        await prisma.articles.create({
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
}

function getLink(potentialMatch: string | null) {
  const linkRegex = /'([^']+)'/;

  if (potentialMatch) {
    const link = potentialMatch.match(linkRegex);

    if (link) {
      return `${chattanooganUrl}${link[1]}`;
    }
  }

  return null;
}

async function getIncompleteArticles(page: Page) {
  const foundArticles = [];
  const table = await page.waitForSelector('table');
  const rows = await table.$$('tr');

  for (var row of rows) {
    const cells = await row.$$('td');

    if (cells.length === 2) {
      const link = getLink(await row.getAttribute('onClick'));

      if (link) {
        // The whitespace replacement is necessary to compare text from the web
        const d = (await cells[1].innerText()).replace(/\s/g, ' ');
        const date = parse(d, 'M/d/yyyy h:mm a', new Date());
        const found: FoundArticle = {
          date,
          link,
          headline: await cells[0].innerText(),
        };

        foundArticles.push(found);
      }
    }
  }

  return foundArticles;
}

async function getRelevantArticleEntries(
  page: Page,
  section: WebsiteSection,
  foundArticles: FoundArticle[],
): Promise<RelevantArticle[]> {
  const relevantArticles: RelevantArticle[] = [];
  const prisma = new PrismaClient();
  for (var currentArticle of foundArticles) {
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
