import { PrismaClient, publishers } from '@prisma/client';
import { Page } from 'playwright';
import { captureException } from '@sentry/node';

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

  abstract saveArticles(articles: RelevantArticle[]): Promise<void>;

  abstract saveStats(numPublished: number, numRelevant: number): Promise<void>;
}
