import { Page } from 'playwright';
import {
  BaseScraper,
  FoundArticle,
  RelevantArticle,
  WebsiteSection,
} from '../types';
import { foxChattanoogaUrl } from './info';

export default class FoxChattanoogaScraper extends BaseScraper {
  async findArticles(page: Page): Promise<FoundArticle[]> {
    const foundArticles: FoundArticle[] = [];
    const identifier = '.index-module_teaser__1f_o';

    const articles = await page.$$(identifier);
    for (let article of articles) {
      // const imageContainer = await article.$('.index-module_image__1tqT');
      // if (!imageContainer)
      //   throw new Error(
      //     'Fox Chattanooga image container class name possibly changed. Please advise.',
      //   );

      // const imageLinkStyle = await imageContainer?.getAttribute('style');
      // if (!imageLinkStyle)
      //   throw new Error(
      //     'Fox Chattanooga image link rendering method possibly changed. Please advise.',
      //   );

      const headlineAndLinkContainer = await article.$$('a');

      const headline = await headlineAndLinkContainer[
        headlineAndLinkContainer.length - 1
      ]?.innerText();

      const link = await headlineAndLinkContainer[
        headlineAndLinkContainer.length - 1
      ]?.getAttribute('href');

      if (!headline)
        throw new Error("Couldn't find headline for Fox Chattanooga article");
      if (!link)
        throw new Error('Could find link href for Fox Chattanooga article');

      foundArticles.push({
        headline,
        link,
        date: new Date(), // just a placeholder value since we don't actually get a date from these
      });
    }

    return foundArticles;
  }
  async getRelevantArticles(
    page: Page,
    section: WebsiteSection,
    foundArticles: FoundArticle[],
  ): Promise<RelevantArticle[]> {
    return [];
  }
  async saveArticles(articles: RelevantArticle[]): Promise<void> {}
  async saveStats(numPublished: number, numRelevant: number): Promise<void> {}

  async getImageLink(style: string) {
    const regex = /url\((.*?)\)/;
    const match = style.match(regex);

    if (match && match[1]) return `${foxChattanoogaUrl}/${match[1]}`;

    throw new Error('Fox Chattanooga image link regex done goofed.');
  }
}
