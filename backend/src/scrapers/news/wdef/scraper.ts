import { Page } from 'playwright';
import {
  BaseScraper,
  FoundArticle,
  RelevantArticle,
  WebsiteSection,
} from '../types';
import Parser from 'rss-parser';
import { parseISO } from 'date-fns';
import { fromToday } from '../generalHelpers';
import { wdefUrl } from './config';

export default class WDEFScraper extends BaseScraper {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findArticles(page: Page): Promise<FoundArticle[]> {
    const found = [];
    const p = new Parser();

    const feed = await p.parseURL('https://wdef.com/feed');
    for (const article of feed.items) {
      const { link, title: headline, isoDate } = article;

      if (link && headline && isoDate) {
        const date = parseISO(isoDate);
        if (fromToday(date))
          found.push({
            headline,
            link,
            date,
          });
      }
    }
    return found;
  }

  async getRelevantArticles(
    page: Page,
    section: WebsiteSection,
    foundArticles: FoundArticle[],
  ): Promise<RelevantArticle[]> {
    const relevantArticles: RelevantArticle[] = [];
    for (const currentArticle of foundArticles) {
      await page.goto(currentArticle.link);

      const article = await page.$('article');
      const imageContainer = await article?.$(
        "//div[contains(@class, 'flowplayer')]",
      );
      const imageContainerStyle = await imageContainer?.getAttribute('style');

      if (!article)
        throw new Error(
          `Couldn't find article element for WDEF article:\n\n ${currentArticle.link}`,
        );
      if (!imageContainer)
        throw new Error(
          `Couldn't find article image container for WDEF article:\n\n ${currentArticle.link}`,
        );
      if (!imageContainerStyle)
        throw new Error(
          `Couldn't find image container style attribute for WDEF article:\n\n ${currentArticle.link}`,
        );

      const imageLink = await this.getImageLink(imageContainerStyle);

      relevantArticles.push({
        headline: currentArticle.headline,
        link: currentArticle.link,
        image: imageLink,
        timePosted: currentArticle.date,
        saved: new Date(),
      });
    }

    return relevantArticles;
  }

  async getImageLink(style: string) {
    const regex = /url\((.*?)\)/;
    const match = style.match(regex);

    if (match && match[1]) return `${wdefUrl}/${match[1]}`;

    throw new Error('WDEF image link regex done goofed.');
  }
}
