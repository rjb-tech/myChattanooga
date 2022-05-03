# ----------------------------------------------------------------------------#
# API SERVER CONTAINER
FROM python:3.9-slim-bullseye as api_server
WORKDIR /myChattanooga
ENV TZ="America/New_York"
ENV POSTGRES_USER "${POSTGRES_USER}"
ENV POSTGRES_PASSWORD "${POSTGRES_PASSWORD}"
ENV POSTGRES_DB "${POSTGRES_DB}"
ENV CONTAINER "${CONTAINER}"
COPY ./backend/shared_tech .
COPY ./backend/api_layer .
# THIS WILL BE CHANGED WHEN THE FILE IS SPLIT
COPY ./backend/requirements.txt .
# install dependencies
RUN apt update && apt upgrade -y && \
    apt install -y --no-install-recommends \
        dos2unix \
        gcc \
        tk \
        python3-setuptools \
        python3-dev \
        libpq-dev && \
    rm -rf /var/lib/apt/lists/* && \
    pip install --no-cache-dir --upgrade -r requirements.txt
ENTRYPOINT bash -c "uvicorn main:app --host 0.0.0.0 --workers 6"

# ----------------------------------------------------------------------------#
# DATABASE CONTAINER
FROM postgres:14-bullseye AS database
WORKDIR /myChattanooga
ENV TZ "America/New_York"
ENV POSTGRES_USER "${POSTGRES_USER}"
ENV POSTGRES_PASSWORD "${POSTGRES_PASSWORD}"
ENV POSTGRES_DB "${POSTGRES_DB}"
ENV CONTAINER "${CONTAINER}"
# Copy SQL init file to make tables
COPY ./backend/shared_tech .
COPY ./backend/data_layer .
RUN apt update && apt upgrade -y && \
    apt install -y --no-install-recommends \
        gcc && \
    rm -rf /var/lib/apt/lists/* && \
    mv ./init.sql /docker-entrypoint-initdb.d/init.sql
EXPOSE 5432

# ----------------------------------------------------------------------------#
# SCRAPER CONTAINER
FROM python:3.9-slim-bullseye as scraper
WORKDIR /myChattanooga
ENV TZ="America/New_York"
ENV POSTGRES_USER "${POSTGRES_USER}"
ENV POSTGRES_PASSWORD "${POSTGRES_PASSWORD}"
ENV POSTGRES_DB "${POSTGRES_DB}"
ENV CONTAINER "${CONTAINER}"
COPY ./backend/shared_tech .
COPY ./backend/scraper_layer .
COPY ./backend/requirements.txt .
RUN mv ./geckodriver /usr/bin
RUN apt update && apt upgrade -y && \
    apt install -y --no-install-recommends \
        libpq-dev \
        firefox-esr \
        gcc \
        python3-dev \
        dos2unix && \
    rm -rf /var/lib/apt/lists/* && \
    pip3 install --no-cache-dir --upgrade -r requirements.txt && \
    mkdir data
ENTRYPOINT bash -c "sleep 15 && python3 weather_scraper.py && python3 news_scraper.py && cat myChattanooga.log 2>&1"

# ----------------------------------------------------------------------------#
# NODE CONTAINER
FROM node:16-alpine as frontend
WORKDIR /myChattanooga
ENV TZ="America/New_York"
RUN apk update && \
    apk upgrade && \
    apk add bash