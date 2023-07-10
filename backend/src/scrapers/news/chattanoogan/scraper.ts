import { Scraper } from '../factory';
import { Page } from 'playwright';
import { chattanooganUrl, ChattanooganSections as sections } from './info';
import { parse } from 'date-fns';

interface FoundArticle {
  headline: string;
  link: string;
  date: Date;
}

export class ChattanooganScraper implements Scraper {
  async scrapeArticles(page: Page): Promise<void> {
    // Article model needed, maybe setup prisma first
    const allArticles = [];
    for (var section of sections) {
      await page.goto(`${chattanooganUrl}/${section.link}`);
      const found = (await getIncompleteArticles(page)).forEach((article) =>
        allArticles.push(article),
      );
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
