-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "news";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "stats";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "weather";

-- CreateEnum
CREATE TYPE "news"."publishers" AS ENUM ('Chattanoogan', 'FoxChattanooga');

-- CreateEnum
CREATE TYPE "weather"."wind_directions" AS ENUM ('N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW');

-- CreateEnum
CREATE TYPE "weather"."weather_locations" AS ENUM ('Airport', 'CoolidgePark', 'Downtown', 'EastBrainerd', 'EastRidge', 'Harrison', 'Hixson', 'NorthChattanooga', 'RedBank', 'SignalMountain', 'SoddyDaisy', 'Southside');

-- CreateTable
CREATE TABLE "news"."articles" (
    "id" SERIAL NOT NULL,
    "headline" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "timePosted" TIMESTAMP(3) NOT NULL,
    "dateSaved" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publisher" "news"."publishers" NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weather"."weather_entries" (
    "location" "weather"."weather_locations" NOT NULL,
    "temp" DECIMAL(65,30) NOT NULL,
    "humidity" INTEGER NOT NULL,
    "weatherCode" INTEGER NOT NULL,
    "weatherDescription" TEXT NOT NULL,
    "sunrise" TIMESTAMP(3) NOT NULL,
    "sunset" TIMESTAMP(3) NOT NULL,
    "windSpeed" DECIMAL(65,30) NOT NULL,
    "windDirection" "weather"."wind_directions" NOT NULL,

    CONSTRAINT "weather_entries_pkey" PRIMARY KEY ("location")
);

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
CREATE INDEX "articles_publisher_dateSaved_idx" ON "news"."articles"("publisher", "dateSaved");

-- CreateIndex
CREATE INDEX "stats_publisher_dateSaved_idx" ON "stats"."stats"("publisher", "dateSaved");
