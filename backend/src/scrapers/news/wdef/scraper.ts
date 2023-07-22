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
    const found: FoundArticle[] = [];
    const p = new Parser();

    const feed = await p.parseURL(this.url);
    for (const currentArticle of feed.items) {
      const { link, title: headline, isoDate } = currentArticle;

      if (link && headline && isoDate) {
        const published = parseISO(isoDate);
        // the weatherupdate article is updated every day, we don't want that shit dirtying our data
        if (fromToday(published) && !link.includes('weatherupdate'))
          found.push({
            headline,
            link,
            published,
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

      const imageLink = await this.getImageLink(imageContainerStyle);

      relevantArticles.push({
        ...currentArticle,
        image: imageLink,
      });
    }

    return relevantArticles;
  }

  async getImageLink(style: string | null | undefined) {
    if (!style)
      return 'https://mychattanooga-files.nyc3.digitaloceanspaces.com/wdef_logo.png';
    const regex = /url\((.*?)\)/;
    const match = style.match(regex);

    if (match && match[1]) return `${wdefUrl}/${match[1]}`;

    throw new Error('WDEF image link regex done goofed.');
  }
}
