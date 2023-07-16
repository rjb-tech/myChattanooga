import { PrismaClient, publishers } from '@prisma/client';
import { Page } from 'playwright';
import { captureException } from '@sentry/node';
import { endOfDay, subDays } from 'date-fns';

export interface WebsiteSection {
  link: string;
  keywords: string[];
}

export interface FoundArticle {
  headline: string;
  link: string;
  date: Date;
}

export interface RelevantArticle {
  headline: string;
  link: string;
  image: string;
  timePosted: Date;
  saved: Date;
}

interface Scraper {
  url: string;
  publisher: publishers;
  sections: WebsiteSection[];
  prisma: PrismaClient;
  scrapeAndSaveNews(page: Page): void;
  saveArticles(articles: RelevantArticle[]): void;
  saveStats(numPublished: number, numRelevant: number): void;
}

export abstract class BaseScraper implements Scraper {
  url: string;
  publisher: publishers;
  sections: WebsiteSection[];
  prisma: PrismaClient;

  constructor(url: string, publisher: publishers, sections: WebsiteSection[]) {
    this.url = url;
    this.publisher = publisher;
    this.sections = sections;
    this.prisma = new PrismaClient();
  }

  async scrapeAndSaveNews(page: Page): Promise<void> {
    const allRelevantArticles: RelevantArticle[] = [];
    for (const section of this.sections) {
      try {
        await page.goto(`${this.url}/${section.link}`);

        const found = await this.findArticles(page);
        const relevant = await this.getRelevantArticles(page, section, found);

        allRelevantArticles.push(...relevant);
        await this.saveStats(found.length, relevant.length);
      } catch (e: any) {
        captureException(
          new Error(
            `Error in ${this.publisher} scraper ${section} section:\n\n ${e}`,
          ),
        );
      }
    }

    this.saveArticles(allRelevantArticles);
  }

  abstract findArticles(page: Page): Promise<FoundArticle[]>;

  abstract getRelevantArticles(
    page: Page,
    section: WebsiteSection,
    foundArticles: FoundArticle[],
  ): Promise<RelevantArticle[]>;

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
            publisher: this.publisher,
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
}
