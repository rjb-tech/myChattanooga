import { PrismaClient, Publishers } from '@prisma/client';
import { Page } from 'playwright';
import { captureException } from '@sentry/node';
import { endOfDay, subDays } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

export interface WebsiteSection {
  link: string;
  keywords: string[];
}

export interface FoundArticle {
  headline: string;
  link: string;
  published: Date;
}

export interface RelevantArticle {
  headline: string;
  link: string;
  image: string;
  published: Date;
}

interface Scraper {
  url: string;
  publisher: Publishers;
  sections: WebsiteSection[];
  prisma: PrismaClient;
  scrapeAndSaveNews(page: Page): void;
  saveArticles(articles: RelevantArticle[]): void;
  saveStats(numPublished: number, numRelevant: number): void;
}

export abstract class BaseScraper implements Scraper {
  url: string;
  publisher: Publishers;
  sections: WebsiteSection[];
  prisma: PrismaClient;

  constructor(
    url: string,
    publisher: Publishers,
    sections: WebsiteSection[],
    prisma: PrismaClient,
  ) {
    this.url = url;
    this.publisher = publisher;
    this.sections = sections;
    this.prisma = prisma;
  }

  async scrapeAndSaveNews(page: Page): Promise<void> {
    const allFoundArticles: FoundArticle[] = [];
    const allRelevantArticles: RelevantArticle[] = [];
    for (const section of this.sections) {
      try {
        const found = await this.findArticles(page, section);
        const relevant = await this.getRelevantArticles(page, section, found);

        allRelevantArticles.push(...relevant);
        allFoundArticles.push(...found);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.log(e);
        captureException(
          new Error(
            `Error in ${this.publisher} scraper ${section.link}:\n\n ${e}`,
          ),
        );
      }
    }

    // Sometime there are multiple repeated articles
    //   gotta trow those out Ton'
    const filteredRelevant = allRelevantArticles.filter(
      (article, idx, self) =>
        idx ===
        self.findIndex(
          (x) => x.headline === article.headline || x.link === article.link,
        ),
    );

    const filteredFound = allFoundArticles.filter(
      (article, idx, self) =>
        idx ===
        self.findIndex(
          (x) => x.headline === article.headline || x.link === article.link,
        ),
    );

    this.saveArticles(filteredRelevant);
    this.saveStats(filteredFound.length, filteredRelevant.length);
  }

  abstract findArticles(
    page: Page,
    section: WebsiteSection,
  ): Promise<FoundArticle[]>;

  abstract getRelevantArticles(
    page: Page,
    section: WebsiteSection,
    foundArticles: FoundArticle[],
  ): Promise<RelevantArticle[]>;

  async saveArticles(articles: RelevantArticle[]): Promise<void> {
    // Select all of today's chattanoogan articles to be able to do if exists checking outside the db
    const dayQueried = endOfDay(zonedTimeToUtc(new Date(), 'America/New_York'));
    const existingArticles = await this.prisma.article.findMany({
      where: {
        publisher: { equals: this.publisher },
        saved: {
          gt: subDays(dayQueried, 1),
          lte: dayQueried,
        },
      },
    });

    for (const article of articles) {
      const alreadyExists = existingArticles.find(
        (existingArticle) =>
          existingArticle.headline === article.headline ||
          existingArticle.link === article.link,
      );

      if (!alreadyExists)
        await this.prisma.article.create({
          data: {
            headline: article.headline,
            link: article.link,
            published: article.published,
            image: article.image,
            publisher: this.publisher,
          },
        });
    }
  }

  async saveStats(numPublished: number, numRelevant: number): Promise<void> {
    const dayQueried = endOfDay(zonedTimeToUtc(new Date(), 'America/New_York'));
    const existingStat = await this.prisma.stat.findFirst({
      select: { id: true },
      where: {
        publisher: this.publisher,
        dateSaved: { gt: subDays(dayQueried, 1), lte: dayQueried },
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
