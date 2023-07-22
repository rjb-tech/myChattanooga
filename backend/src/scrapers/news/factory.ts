import ChattanooganScraper from './chattanoogan/scraper';
import { publishers } from '@prisma/client';
import { ChattanooganSections, chattanooganUrl } from './chattanoogan/config';
import FoxChattanoogaScraper from './foxChattanooga/scraper';
import {
  foxChattanoogaSections,
  foxChattanoogaUrl,
} from './foxChattanooga/config';
import WDEFScraper from './wdef/scraper';
import { wdefSections, wdefUrl } from './wdef/config';
import TimesFreePressScraper from './timesFreePress/scraper';
import {
  timesFreePressSections,
  timesFreePressUrl,
} from './timesFreePress/config';
import ChattanoogaPulseScraper from './chattanoogaPulse/scraper';
import {
  chattanoogaPulseSections,
  chattanoogaPulseUrl,
} from './chattanoogaPulse/config';
import ChattNewsChronicleScraper from './ChattNewsChronicle/scraper';
import {
  chattNewsChronicleSections,
  chattNewsChronicleUrl,
} from './ChattNewsChronicle/config';
import Local3NewsScraper from './local3/scraper';
import { local3Sections, local3Url } from './local3/config';

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
        return new WDEFScraper(wdefUrl, publishers.WDEF, wdefSections);
      case publishers.TimesFreePress:
        return new TimesFreePressScraper(
          timesFreePressUrl,
          publishers.TimesFreePress,
          timesFreePressSections,
        );
      case publishers.ChattanoogaPulse:
        return new ChattanoogaPulseScraper(
          chattanoogaPulseUrl,
          publishers.ChattanoogaPulse,
          chattanoogaPulseSections,
        );
      case publishers.ChattNewsChronicle:
        return new ChattNewsChronicleScraper(
          chattNewsChronicleUrl,
          publishers.ChattNewsChronicle,
          chattNewsChronicleSections,
        );
      case publishers.Local3News:
        return new Local3NewsScraper(
          local3Url,
          publishers.Local3News,
          local3Sections,
        );
    }
  }
}
