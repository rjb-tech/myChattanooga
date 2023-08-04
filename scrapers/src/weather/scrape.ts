import { PrismaClient, WeatherLocations } from '@prisma/client';
import 'dotenv/config';
import { parse } from 'date-fns';
import { captureException, init as initSentry } from '@sentry/node';
import { getDirection } from './helpers';
import { locations } from './config';

initSentry({
  dsn: 'https://de875782d88948139f9af89fd16cea3f@o4505525322317824.ingest.sentry.io/4505525386674176',
  environment: process.env.DEPLOYMENT_ENV ?? 'dev',
  tracesSampleRate: 0.75,
});

function scrape() {
  const prisma = new PrismaClient({
    log: ['query', 'info'],
  });

  const results = Object.keys(WeatherLocations).map(async (currentLocation) => {
    try {
      const currentLocationData = locations.find(
        (location) => location.name === currentLocation,
      );
      if (currentLocationData) {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${currentLocationData.latitude}&lon=${currentLocationData.longitude}&appid=${process.env['OWM_API_KEY']}&units=imperial`,
        );
        const data = await response.json();

        const locationEnum: WeatherLocations =
          currentLocation as WeatherLocations;

        return await prisma.weather.update({
          where: {
            location: locationEnum,
          },
          data: {
            location: locationEnum,
            temp: data.main.temp,
            humidity: data.main.humidity,
            weatherCode: data.weather[0].id,
            weatherDescription: data.weather[0].description,
            sunrise: parse(data.sys.sunrise, 't', new Date()),
            sunset: parse(data.sys.sunset, 't', new Date()),
            windSpeed: data.wind.speed,
            windDirection: getDirection(data.wind.deg),
          },
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.log(e);
      captureException(`Error in weather scraper: ${e}`);
    }
  });

  Promise.all(results);
}

scrape();
