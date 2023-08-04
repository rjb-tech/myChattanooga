FROM buildpack-deps:bullseye as scraper
WORKDIR /scrapers
ENV TZ="America/New_York"
ENV DATABASE_URL="${DATABASE_URL}"
ENV OWM_API_KEY="${OWM_API_KEY}"
ENV DEPLOYMENT_ENV="${DEPLOYMENT_ENV}"
COPY /scrapers .
RUN apt update && \
    apt install -y libnss3 libglib2.0-0 libgbm1 libxshmfence-dev ca-certificates
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt update && apt install -y nodejs
RUN npm install
RUN npx playwright install --with-deps chromium
RUN npx prisma generate