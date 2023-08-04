import ChattanooganScraper from './chattanoogan/scraper';
import { PrismaClient, Publishers } from '@prisma/client';
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

const prisma = new PrismaClient();

export default class ScraperFactory {
  getScraperInstance(publisher: Publishers) {
    switch (publisher) {
      case Publishers.Chattanoogan:
        return new ChattanooganScraper(
          chattanooganUrl,
          Publishers.Chattanoogan,
          ChattanooganSections,
          prisma,
        );
      case Publishers.FoxChattanooga:
        return new FoxChattanoogaScraper(
          foxChattanoogaUrl,
          Publishers.FoxChattanooga,
          foxChattanoogaSections,
          prisma,
        );
      case Publishers.WDEF:
        return new WDEFScraper(wdefUrl, Publishers.WDEF, wdefSections, prisma);
      case Publishers.TimesFreePress:
        return new TimesFreePressScraper(
          timesFreePressUrl,
          Publishers.TimesFreePress,
          timesFreePressSections,
          prisma,
        );
      case Publishers.ChattanoogaPulse:
        return new ChattanoogaPulseScraper(
          chattanoogaPulseUrl,
          Publishers.ChattanoogaPulse,
          chattanoogaPulseSections,
          prisma,
        );
      case Publishers.ChattNewsChronicle:
        return new ChattNewsChronicleScraper(
          chattNewsChronicleUrl,
          Publishers.ChattNewsChronicle,
          chattNewsChronicleSections,
          prisma,
        );
      case Publishers.Local3News:
        return new Local3NewsScraper(
          local3Url,
          Publishers.Local3News,
          local3Sections,
          prisma,
        );
    }
  }
}
