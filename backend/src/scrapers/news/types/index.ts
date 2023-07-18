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
}

interface Scraper {
  url: string;
  publisher: publishers;
  sections: WebsiteSection[];
  prisma: PrismaClient;
  isRss: boolean;
  scrapeAndSaveNews(page: Page): void;
  saveArticles(articles: RelevantArticle[]): void;
  saveStats(numPublished: number, numRelevant: number): void;
}

export abstract class BaseScraper implements Scraper {
  url: string;
  publisher: publishers;
  sections: WebsiteSection[];
  prisma: PrismaClient;
  isRss: boolean;

  constructor(
    url: string,
    publisher: publishers,
    sections: WebsiteSection[],
    isRss = false,
  ) {
    this.url = url;
    this.publisher = publisher;
    this.sections = sections;
    this.prisma = new PrismaClient();
    this.isRss = isRss;
  }

  async scrapeAndSaveNews(page: Page, isRss = false): Promise<void> {
    const allFoundArticles: FoundArticle[] = [];
    const allRelevantArticles: RelevantArticle[] = [];
    for (const section of this.sections) {
      try {
        // Don't download rss feed
        if (!isRss) await page.goto(`${this.url}/${section.link}`);

        const found = await this.findArticles(page);
        const relevant = await this.getRelevantArticles(page, section, found);

        allRelevantArticles.push(...relevant);
        allFoundArticles.push(...found);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        captureException(
          new Error(
            `Error in ${this.publisher} scraper ${section} section:\n\n ${e}`,
          ),
        );
      }
    }

    this.saveArticles(allRelevantArticles);
    this.saveStats(allFoundArticles.length, allRelevantArticles.length);
  }

  abstract findArticles(page: Page): Promise<FoundArticle[]>;

  abstract getRelevantArticles(
    page: Page,
    section: WebsiteSection,
    foundArticles: FoundArticle[],
  ): Promise<RelevantArticle[]>;

  async saveArticles(articles: RelevantArticle[]): Promise<void> {
    // Select all of today's chattanoogan articles to be able to do if exists checking outside the db
    const existingArticles = await this.prisma.article.findMany({
      where: {
        publisher: { equals: this.publisher },
        saved: {
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
        await this.prisma.article.create({
          data: {
            headline: article.headline,
            link: article.link,
            published: article.timePosted,
            image: article.image,
            publisher: this.publisher,
          },
        });
    }
  }

  async saveStats(numPublished: number, numRelevant: number): Promise<void> {
    const existingStat = await this.prisma.stat.findFirst({
      select: { id: true },
      where: {
        publisher: this.publisher,
        dateSaved: { gt: subDays(new Date(), 1), lte: new Date() },
      },
    });

    if (existingStat)
      await this.prisma.stat.update({
        where: {
          id: existingStat.id,
        },
        data: {
          numPublished: numPublished,
          numRelevant: numRelevant,
        },
      });
    else
      await this.prisma.stat.create({
        data: {
          publisher: this.publisher,
          numRelevant: numRelevant,
          numPublished: numPublished,
        },
      });
  }
}
