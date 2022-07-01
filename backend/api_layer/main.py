import logging
import asyncio
from utils import VerifyToken
from urllib import response
from sqlalchemy.sql import select
from fastapi import FastAPI, Query, Depends, Response, status
from fastapi.security import HTTPBearer
from database_module import Article, Weather, Stat, BrewsRelease, MC_Connection
from result import Result, Ok, Err
from typing import List, Optional

# Scheme for the Authorization header
token_auth_scheme = HTTPBearer()


# Configure logger
logging.basicConfig(
    filename="myChattanooga.log",
    filemode="a",
    format="%(asctime)s - %(message)s",
    datefmt="%d-%b-%y %H:%M:%S",
    level=logging.INFO,
)

app = FastAPI()
database = MC_Connection()


@app.on_event("startup")
async def startup():
    await database.plug_in()


@app.on_event("shutdown")
async def shutdown():
    await database.unplug()


@app.get("/healthcheck", status_code=200)
async def healthcheck():
    return "Ok"


@app.get("/brews", response_model=List[BrewsRelease], response_model_exclude_none=True)
async def get_brews_releases(publishers: list = Query(["all"])):
    async def get_brews():
        # Get result from the MC_Connection method and check for validity
        #   before sending payload
        query_table = database.get_table("brews")
        if isinstance(query_table, Ok):
            table = query_table.unwrap()
            full_query = table.select().order_by(table.c.date_posted.desc())
            filtered_query = (
                select(table)
                .where(table.c.publisher.in_(publishers))
                .order_by(table.c.date_posted.desc())
            )
            if publishers[0] == "all":
                data = await database.get_db_obj().fetch_all(full_query)
            else:
                data = await database.get_db_obj().fetch_all(filtered_query)
            return [row for row in data]
        else:
            return "DB Module error"

    query_results = await get_query_results(get_brews)
    return query_results


# TODO
@app.post("/brews/create")
async def create_brews_release(token: str = Depends(token_auth_scheme)):
    result = VerifyToken(token.credentials).verify()

    if result.get("status"):
       response.status_code = status.HTTP_400_BAD_REQUEST
       return result

    return result


# TODO
@app.post("/brews/approve")
async def create_brews_release(token: str = Depends(token_auth_scheme)):
    result = token.credentials

    return result


@app.get("/articles", response_model=List[Article], response_model_exclude_none=True)
async def today_articles(publishers: list = Query(["all"])):
    async def get_articles():
        # Get result from the MC_Connection method and check for validity
        #   before sending payload
        query_table = database.get_table("articles")
        if isinstance(query_table, Ok):
            table = query_table.unwrap()
            full_query = table.select().order_by(table.c.time_posted.desc())
            filtered_query = (
                select(table)
                .where(table.c.publisher.in_(publishers))
                .order_by(table.c.time_posted.desc())
            )
            if publishers[0] == "all":
                data = await database.get_db_obj().fetch_all(full_query)
            else:
                data = await database.get_db_obj().fetch_all(filtered_query)
            return [row for row in data]
        else:
            return "DB Module error"

    query_results = await get_query_results(get_articles)
    return query_results


@app.get("/weather", response_model=List[Weather], response_model_exclude_none=True)
async def today_weather(location: str = "all"):
    async def get_weather():
        query_table = database.get_table("weather")
        if isinstance(query_table, Ok):
            table = query_table.unwrap()
            full_query = table.select()
            filtered_query = select(table).where(table.c.weather_location == location)
            if location == "all":
                data = await database.get_db_obj().fetch_all(full_query)
            else:
                data = await database.get_db_obj().fetch_all(filtered_query)
            return [row for row in data]

    query_results = await get_query_results(get_weather)
    return query_results


# @app.get("/stats", response_model=List[Stat], response_model_exclude_none=True)
# async def today_stats():
#     async def get_stats():
#         # Get result from the MC_Connection method and check for validity
#         #   before sending payload
#         query_base = database.get_table("stats")
#         if isinstance(query_base, Ok):
#             full_query = query_base.unwrap().select()
#             data = await database.get_db_obj().fetch_all(full_query)
#             return [row for row in data]

#     query_results = await get_query_results(get_stats)
#     return query_results


# UTILITY FUNCTION FOR QUERIES
# Handles db connect and disconnect
async def get_query_results(input_async_function):
    if not database.is_connected():
        await database.plug_in()
    if database.is_connected():
        async_results = await input_async_function()
    await database.unplug()
    return async_results
