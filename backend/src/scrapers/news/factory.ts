import ChattanooganScraper from './chattanoogan/scraper';
import { publishers } from '@prisma/client';
import { ChattanooganSections, chattanooganUrl } from './chattanoogan/config';
import FoxChattanoogaScraper from './foxChattanooga/scraper';
import {
  foxChattanoogaSections,
  foxChattanoogaUrl,
} from './foxChattanooga/config';
import WDEFScraper from './wdef/scraper';
import { wdefRssUrl, wdefSections } from './wdef/config';
import TimesFreePressScraper from './timesFreePress/scraper';
import {
  timesFreePressSections,
  timesFreePressUrl,
} from './timesFreePress/config';

/* https://medium.com/codex/factory-pattern-type-script-implementation-with-type-map-ea422f38862 */

export default class ScraperFactory {
  getScraperInstance(publisher: publishers) {
    switch (publisher) {
      case publishers.Chattanoogan:
        return new ChattanooganScraper(
          chattanooganUrl,
          publishers.Chattanoogan,
          ChattanooganSections,
        );
      case publishers.FoxChattanooga:
        return new FoxChattanoogaScraper(
          foxChattanoogaUrl,
          publishers.FoxChattanooga,
          foxChattanoogaSections,
        );
      case publishers.WDEF:
        return new WDEFScraper(wdefRssUrl, publishers.WDEF, wdefSections, true);
      case publishers.TimesFreePress:
        return new TimesFreePressScraper(
          timesFreePressUrl,
          publishers.TimesFreePress,
          timesFreePressSections,
        );
    }
  }
}
