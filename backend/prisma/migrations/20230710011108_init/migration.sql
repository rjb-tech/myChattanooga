-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "news";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "stats";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "weather";

-- CreateEnum
CREATE TYPE "news"."Publishers" AS ENUM ('Chattanoogan');

-- CreateEnum
CREATE TYPE "weather"."WindDirections" AS ENUM ('N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW');

-- CreateEnum
CREATE TYPE "weather"."WeatherLocations" AS ENUM ('Airport', 'CoolidgePark', 'Downtown', 'EastBrainerd', 'EastRidge', 'Harrison', 'Hixson', 'NorthChattanooga', 'RedBank', 'SignalMountain', 'SoddyDaisy', 'Southside');

-- CreateTable
CREATE TABLE "news"."Article" (
    "id" SERIAL NOT NULL,
    "headline" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "timePosted" TIMESTAMP(3) NOT NULL,
    "saved" TIMESTAMP(3) NOT NULL,
    "publisher" "news"."Publishers" NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weather"."WeatherEntry" (
    "location" "weather"."WeatherLocations" NOT NULL,
    "temp" DECIMAL(65,30) NOT NULL,
    "humidity" INTEGER NOT NULL,
    "weatherCode" INTEGER NOT NULL,
    "weatherDescription" TEXT NOT NULL,
    "sunrise" TIMESTAMP(3) NOT NULL,
    "sunset" TIMESTAMP(3) NOT NULL,
    "windSpeed" DECIMAL(65,30) NOT NULL,
    "windDirection" "weather"."WindDirections" NOT NULL,

    CONSTRAINT "WeatherEntry_pkey" PRIMARY KEY ("location")
);

-- CreateTable
CREATE TABLE "stats"."StatsEntry" (
    "id" SERIAL NOT NULL,
    "publisher" "news"."Publishers" NOT NULL,
    "scraped" INTEGER NOT NULL,
    "relevant" INTEGER NOT NULL,
    "saved" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StatsEntry_pkey" PRIMARY KEY ("id")
);
