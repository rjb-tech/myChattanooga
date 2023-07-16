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

export default class FoxChattanoogaScraper extends BaseScraper {
  async findArticles(page: Page): Promise<FoundArticle[]> {
    const foundArticles: FoundArticle[] = [];
    const articles = await page.$$(
      "//div[contains(@class, 'index-module_teaser')]",
    );

    for (const article of articles) {
      const headlineAndLinkContainer = await article.$$('a');

      const currentHeadline = await headlineAndLinkContainer[
        headlineAndLinkContainer.length - 1
      ]?.innerText();

      const currentLink = await headlineAndLinkContainer[
        headlineAndLinkContainer.length - 1
      ]?.getAttribute('href');

      if (!currentHeadline)
        throw new Error("Couldn't find headline for Fox Chattanooga article");
      if (!currentLink)
        throw new Error('Could find link href for Fox Chattanooga article');

      foundArticles.push({
        headline: currentHeadline,
        link: `${foxChattanoogaUrl}/${currentLink}`,
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
    const relevantArticles: RelevantArticle[] = [];
    for (const currentArticle of foundArticles) {
      await page.goto(currentArticle.link);

      const story = await page.$("//div[contains(@class, 'storyContainer')]");
      const contentSection = await story?.$(
        "xpath=//div[contains(@class, 'StoryText')]",
      );
      const imageLinkContainer = await story?.$('img');
      const imageLink = await imageLinkContainer?.getAttribute('src');

      const timeTag = await page.$('time');
      const time = await timeTag?.getAttribute('datetime');
      if (time) {
        const datetime = parseJSON(time);
        const relevant = isRelevantArticle(
          (await contentSection?.innerText()) ?? '',
          currentArticle.headline,
          section.keywords,
        );

        if (relevant && fromToday(datetime)) {
          relevantArticles.push({
            headline: currentArticle.headline,
            link: currentArticle.link,
            image: `${foxChattanoogaUrl}${imageLink}`,
            timePosted: datetime,
            saved: new Date(),
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
