FROM python:3.9-slim-buster
LABEL version="0.2"
LABEL description="myChattanooga daily scraper environment"

# timezone set
ENV TZ="America/New_York"

# Copy files and stuff and such and so forth and so on
WORKDIR /home/myChattanooga
COPY ./app .
COPY ./requirements.txt .
COPY ./app/scraper_cron /etc/cron.d/scraper_cron
RUN mkdir data

# install system dependencies
RUN mv geckodriver /usr/bin
RUN apt update && apt upgrade -y && apt install -y --no-install-recommends \
    firefox-esr \
    python3-pip \
    python3 \
    dos2unix \
    cron \
    tk \
 && rm -rf /var/lib/apt/lists/*

# Install python requirements and create DB tables
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Install cron job to system (NOTE: Cron still needs to be started with service cron start)
RUN chmod 0644 /etc/cron.d/scraper_cron
RUN crontab /etc/cron.d/scraper_cron
RUN chmod +x entrypoint.sh

ENTRYPOINT bash -c "python3 create_tables.py && \
                    service cron start && \
                    uvicorn main:app --host 0.0.0.0"