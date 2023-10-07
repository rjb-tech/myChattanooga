import { Page } from 'playwright';
import {
  BaseScraper,
  FoundArticle,
  RelevantArticle,
  WebsiteSection,
} from '../types';
import { foxChattanoogaUrl } from './config';
import { parseJSON } from 'date-fns';
import { fromToday, isRelevantArticle } from '../generalHelpers';
import { utcToZonedTime } from 'date-fns-tz';

export default class FoxChattanoogaScraper extends BaseScraper {
  async findArticles(
    page: Page,
    section: WebsiteSection,
  ): Promise<FoundArticle[]> {
    await page.goto(`${this.url}/${section.link}`);

    const foundArticles: FoundArticle[] = [];
    const articles = await page.$$(
      "//div[contains(@class, 'index-module_teaser')]",
    );

    if (articles.length === 0)
      throw new Error('Fox Chattanooga article selector broken');

    for (const article of articles) {
      const headlineAndLinkContainer = await article.$$('a');

      const currentHeadline = await headlineAndLinkContainer[
        headlineAndLinkContainer.length - 1
      ]?.innerText();

      const currentLink = await headlineAndLinkContainer[
        headlineAndLinkContainer.length - 1
      ]?.getAttribute('href');

      if (!currentHeadline)
        throw new Error(
          `Couldn't find headline for Fox Chattanooga article: ${JSON.stringify(
            headlineAndLinkContainer,
          )}`,
        );
      if (!currentLink)
        throw new Error(
          `Couldn't find link href for Fox Chattanooga article: ${JSON.stringify(
            headlineAndLinkContainer,
          )}`,
        );

      foundArticles.push({
        headline: currentHeadline,
        link: `${foxChattanoogaUrl}${currentLink.split('#')[0]}`, // remove url fragment it's fucking it page load
        published: new Date(), // just a placeholder value since we don't actually get a date from these
      });
    }
    // Only grab the first 5 articles bc there are too damn many to always send them all.
    // Repeats are fine
    return foundArticles.filter((x, idx) => idx < 5);
  }

  async getRelevantArticles(
    page: Page,
    section: WebsiteSection,
    foundArticles: FoundArticle[],
  ): Promise<RelevantArticle[]> {
    const relevantArticles: RelevantArticle[] = [];

    for (const currentArticle of foundArticles) {
      await page.goto(currentArticle.link);

      const story = await page.$(
        "xpath=//div[contains(@class, 'storyContainer')]",
      );

      if (!story)
        throw new Error('Fox Chattanooga article element selector broken');

      // Sometimes the class containing storytext renders with weird casing
      // This converts it to lower and searches. Weird shit just letting you know
      const contentSection = await story?.$(
        `xpath=//div[contains(translate(@class, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'storytext')]`,
      );

      const timeTag = await page.$('time');
      const time = await timeTag?.getAttribute('datetime');

      if (time) {
        const published = parseJSON(time);
        const zonedPublished = utcToZonedTime(published, "America/New_York")

        const relevant = isRelevantArticle(
          (await contentSection?.innerText()) ?? '',
          currentArticle.headline,
          section.keywords,
        );

        if (relevant && fromToday(zonedPublished)) {
          relevantArticles.push({
            ...currentArticle,
            published: zonedPublished,
          });
        }
      }
    }

    return relevantArticles;
  }

  async getImageLink(style: string) {
    const regex = /url\((.*?)\)/;
    const match = style.match(regex);

    if (match && match[1]) return `${foxChattanoogaUrl}/${match[1]}`;

    throw new Error('Fox Chattanooga image link regex done goofed.');
  }
}
