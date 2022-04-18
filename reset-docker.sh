docker stop api
docker stop database
docker stop scraper
docker stop frontend
docker system prune
docker image rm mychattanooga_api
docker image rm mychattanooga_database
docker image rm mychattanooga_scraper
docker image rm mychattanooga_frontend
clear
