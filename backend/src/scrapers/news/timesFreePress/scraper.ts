import { Page } from 'playwright';
import {
  BaseScraper,
  FoundArticle,
  RelevantArticle,
  WebsiteSection,
} from '../types';

export default class TimesFreePressScraper extends BaseScraper {
  async findArticles(page: Page): Promise<FoundArticle[]> {
    return [];
  }

  async getRelevantArticles(
    page: Page,
    section: WebsiteSection,
    foundArticles: FoundArticle[],
  ): Promise<RelevantArticle[]> {
    return [];
  }
}
