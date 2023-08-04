FROM buildpack-deps:bullseye as scraper
WORKDIR /scrapers
ENV TZ="America/New_York"
ENV DATABASE_URL="${DATABASE_URL}"
ENV OWM_API_KEY="${OWM_API_KEY}"
ENV DEPLOYMENT_ENV="${DEPLOYMENT_ENV}"
COPY /scrapers .
RUN apt-get update && \
    apt-get install -y libnss3 libglib2.0-0 libgbm1 libxshmfence-dev ca-certificates
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs
RUN npm install
RUN npx playwright install-deps
RUN npx playwright install firefox
RUN npx prisma generate