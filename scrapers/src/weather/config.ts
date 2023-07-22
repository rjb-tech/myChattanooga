import { WeatherLocation } from './types';

export const locations: WeatherLocation[] = [
  { name: 'Airport', latitude: 35.037384, longitude: -85.196596 },
  { name: 'CoolidgePark', latitude: 35.060666, longitude: -85.307835 },
  { name: 'Downtown', latitude: 35.055072, longitude: -85.311388 },
  {
    name: 'EastBrainerd',
    latitude: 35.035135,
    longitude: -85.156978,
  },
  {
    name: 'EastRidge',
    latitude: 34.991181,
    longitude: -85.229127,
  },
  { name: 'Harrison', latitude: 35.114548, longitude: -85.138063 },
  { name: 'Hixson', latitude: 35.130611, longitude: -85.241446 },
  {
    name: 'NorthChattanooga',
    latitude: 35.069496,
    longitude: -85.289329,
  },
  { name: 'RedBank', latitude: 35.110136, longitude: -85.295099 },
  {
    name: 'SignalMountain',
    latitude: 35.142164,
    longitude: -85.3422,
  },
  {
    name: 'SoddyDaisy',
    latitude: 35.237057,
    longitude: -85.183266,
  },
  {
    name: 'Southside',
    latitude: 35.037511,
    longitude: -85.307215,
  },
];

export const directions: string[] = [
  'N',
  'NNE',
  'NE',
  'ENE',
  'E',
  'ESE',
  'SE',
  'SSE',
  'S',
  'SSW',
  'SW',
  'WSW',
  'W',
  'WNW',
  'NW',
  'NNW',
];
