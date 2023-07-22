-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "News";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Stats";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Weather";

-- CreateEnum
CREATE TYPE "News"."Publishers" AS ENUM ('Chattanoogan', 'FoxChattanooga', 'WDEF', 'TimesFreePress', 'ChattanoogaPulse', 'ChattNewsChronicle', 'Local3News');

-- CreateEnum
CREATE TYPE "Weather"."WindDirections" AS ENUM ('N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW');

-- CreateEnum
CREATE TYPE "Weather"."WeatherLocations" AS ENUM ('Airport', 'CoolidgePark', 'Downtown', 'EastBrainerd', 'EastRidge', 'Harrison', 'Hixson', 'NorthChattanooga', 'RedBank', 'SignalMountain', 'SoddyDaisy', 'Southside');

-- CreateTable
CREATE TABLE "News"."Articles" (
    "id" SERIAL NOT NULL,
    "headline" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "published" TIMESTAMP(3) NOT NULL,
    "saved" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publisher" "News"."Publishers" NOT NULL,

    CONSTRAINT "Articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Weather"."Weather" (
    "location" "Weather"."WeatherLocations" NOT NULL,
    "temp" DECIMAL(65,30) NOT NULL,
    "humidity" INTEGER NOT NULL,
    "weatherCode" INTEGER NOT NULL,
    "weatherDescription" TEXT NOT NULL,
    "sunrise" TIMESTAMP(3) NOT NULL,
    "sunset" TIMESTAMP(3) NOT NULL,
    "windSpeed" DECIMAL(65,30) NOT NULL,
    "windDirection" "Weather"."WindDirections" NOT NULL,

    CONSTRAINT "Weather_pkey" PRIMARY KEY ("location")
);

-- CreateTable
CREATE TABLE "Stats"."Stats" (
    "id" SERIAL NOT NULL,
    "publisher" "News"."Publishers" NOT NULL,
    "numPublished" INTEGER NOT NULL,
    "numRelevant" INTEGER NOT NULL,
    "dateSaved" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Articles_publisher_saved_idx" ON "News"."Articles"("publisher", "saved");

-- CreateIndex
CREATE INDEX "Stats_publisher_dateSaved_idx" ON "Stats"."Stats"("publisher", "dateSaved");
