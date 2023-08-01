build-scraper:
	docker build --target scraper -t mychattanooga_scraper .
scrape-news:
	docker-compose up news_scraper
scrape-weather:
	docker-compose up weather_scraper