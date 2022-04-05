FROM ubuntu
LABEL version="0.1"
LABEL description="myChattanooga daily scraper environment"

# timezone set
ENV TZ="America/New_York"

# Copy files and stuff 
WORKDIR /home/myChattanooga
COPY ./app .
COPY ./requirements.txt .
RUN mkdir data

# firefox and geckodriver install stuff
RUN mv geckodriver /usr/bin
RUN apt update && apt upgrade -y
RUN apt install firefox -y

# Install python and dependencies
RUN apt install python3-pip -y
RUN apt install python3 -y
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Install cron and start 
RUN apt install cron -y
COPY ./app/scraper_cron /etc/cron.d/scraper_cron
RUN chmod 0644 /etc/cron.d/scraper_cron
RUN crontab /etc/cron.d/scraper_cron
RUN service start cron

# Create DB tables
RUN python3 create_tables.py
