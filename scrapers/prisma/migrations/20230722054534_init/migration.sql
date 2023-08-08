-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "news";

GRANT USAGE 
ON SCHEMA "news" 
TO postgres, anon, authenticated, service_role, dashboard_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA "news"
GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role, dashboard_user;

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "stats";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "weather";

GRANT USAGE 
ON SCHEMA "weather" 
TO postgres, anon, authenticated, service_role, dashboard_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA "weather"
GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role, dashboard_user;

-- CreateEnum
CREATE TYPE "news"."publishers" AS ENUM ('Chattanoogan', 'FoxChattanooga', 'WDEF', 'TimesFreePress', 'ChattanoogaPulse', 'ChattNewsChronicle', 'Local3News');

-- CreateEnum
CREATE TYPE "weather"."wind_directions" AS ENUM ('N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW');

-- CreateEnum
CREATE TYPE "weather"."weather_locations" AS ENUM ('Airport', 'CoolidgePark', 'Downtown', 'EastBrainerd', 'EastRidge', 'Harrison', 'Hixson', 'NorthChattanooga', 'RedBank', 'SignalMountain', 'SoddyDaisy', 'Southside');

-- CreateTable
CREATE TABLE "news"."articles" (
    "id" SERIAL NOT NULL,
    "headline" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "published" TIMESTAMP(3) NOT NULL,
    "saved" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publisher" "news"."publishers" NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weather"."weather" (
    "location" "weather"."weather_locations" NOT NULL,
    "temp" DECIMAL(65,30) NOT NULL,
    "humidity" INTEGER NOT NULL,
    "weatherCode" INTEGER NOT NULL,
    "weatherDescription" TEXT NOT NULL,
    "sunrise" TIMESTAMP(3) NOT NULL,
    "sunset" TIMESTAMP(3) NOT NULL,
    "windSpeed" DECIMAL(65,30) NOT NULL,
    "windDirection" "weather"."wind_directions" NOT NULL,

    CONSTRAINT "weather_pkey" PRIMARY KEY ("location")
);

-- Add dummy data to weather table so scraper updates work
INSERT INTO "weather"."weather" ("location", "temp", "humidity", "weatherCode", "weatherDescription", "sunrise", "sunset", "windSpeed", "windDirection")
VALUES
  ('Airport', 25.5, 60, 800, 'Clear sky', '2023-07-21 06:00:00', '2023-07-21 18:00:00', 12.5, 'N'),
  ('CoolidgePark', 24.8, 58, 801, 'Few clouds', '2023-07-21 05:45:00', '2023-07-21 18:15:00', 10.2, 'NNE'),
  ('Downtown', 26.2, 62, 802, 'Scattered clouds', '2023-07-21 05:30:00', '2023-07-21 18:30:00', 13.7, 'NE'),
  ('EastBrainerd', 27.0, 65, 803, 'Broken clouds', '2023-07-21 05:15:00', '2023-07-21 18:45:00', 14.8, 'ENE'),
  ('EastRidge', 26.5, 63, 804, 'Overcast clouds', '2023-07-21 05:00:00', '2023-07-21 19:00:00', 13.0, 'E'),
  ('Harrison', 25.8, 61, 701, 'Mist', '2023-07-21 04:45:00', '2023-07-21 19:15:00', 9.5, 'ESE'),
  ('Hixson', 24.9, 59, 741, 'Fog', '2023-07-21 04:30:00', '2023-07-21 19:30:00', 8.2, 'SE'),
  ('NorthChattanooga', 23.7, 56, 701, 'Mist', '2023-07-21 04:15:00', '2023-07-21 19:45:00', 7.3, 'SSE'),
  ('RedBank', 24.0, 57, 802, 'Scattered clouds', '2023-07-21 04:00:00', '2023-07-21 20:00:00', 7.8, 'S'),
  ('SignalMountain', 23.5, 55, 803, 'Broken clouds', '2023-07-21 03:45:00', '2023-07-21 20:15:00', 6.5, 'SSW'),
  ('SoddyDaisy', 22.8, 53, 804, 'Overcast clouds', '2023-07-21 03:30:00', '2023-07-21 20:30:00', 5.9, 'SW'),
  ('Southside', 22.3, 52, 701, 'Mist', '2023-07-21 03:15:00', '2023-07-21 20:45:00', 5.4, 'WSW');

-- CreateTable
CREATE TABLE "stats"."stats" (
    "id" SERIAL NOT NULL,
    "publisher" "news"."publishers" NOT NULL,
    "numPublished" INTEGER NOT NULL,
    "numRelevant" INTEGER NOT NULL,
    "dateSaved" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "articles_publisher_saved_idx" ON "news"."articles"("publisher", "saved");

-- CreateIndex
CREATE INDEX "stats_publisher_dateSaved_idx" ON "stats"."stats"("publisher", "dateSaved");
