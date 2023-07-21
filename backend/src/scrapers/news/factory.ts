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
import ChattanoogaPulseScraper from './chattanoogaPulse/scraper';
import {
  chattanoogaPulseRssUrl,
  chattanoogaPulseSections,
} from './chattanoogaPulse/config';
import ChattNewsChronicleScraper from './ChattNewsChronicle/scraper';
import {
  chattNewsChronicleRssUrl,
  chattNewsChronicleSections,
} from './ChattNewsChronicle/config';
import Local3NewsScraper from './local3/scraper';
import { local3RssUrl, local3Sections } from './local3/config';

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
      case publishers.ChattanoogaPulse:
        return new ChattanoogaPulseScraper(
          chattanoogaPulseRssUrl,
          publishers.ChattanoogaPulse,
          chattanoogaPulseSections,
          true,
        );
      case publishers.ChattNewsChronicle:
        return new ChattNewsChronicleScraper(
          chattNewsChronicleRssUrl,
          publishers.ChattNewsChronicle,
          chattNewsChronicleSections,
          true,
        );
      case publishers.Local3News:
        return new Local3NewsScraper(
          local3RssUrl,
          publishers.Local3News,
          local3Sections,
          true,
        );
    }
  }
}
