import { PrismaClient, Publishers, WeatherLocations } from '@prisma/client';
import { locations } from './config';
import 'dotenv/config';
import { getDirection } from './helpers';
import { parse } from 'date-fns';

function scrape() {
  const prisma = new PrismaClient();

  const results = Object.keys(WeatherLocations).map(async (currentLocation) => {
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
  });

  Promise.all(results);
}

scrape();
