import logging
import asyncio

import pytz
from datetime import datetime
from os import stat
from pydantic import BaseModel
from utils import VerifyToken
import sqlalchemy as sa
from databases import Database
from sqlalchemy.sql import select, update
from fastapi import FastAPI, Query, Depends, Response, status
from fastapi.security import HTTPBearer
from fastapi.middleware.cors import CORSMiddleware
from database_module import Article, Weather, Stat, BrewsRelease, MC_Connection
from result import Result, Ok, Err
from typing import List, Optional, Union

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


class BrewsRequestInfo(BaseModel):
    headline: str
    publisher: str


origins = [
    "http://localhost:3000",
    "https://api.mychattanooga.app",
    "https://mychattanooga.app",
    "http://0.0.0.0:3000",
    "http://127.0.0.1:3000",
]

app = FastAPI(docs_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH"],
    allow_headers=["*"],
)

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


@app.get("/brews", response_model=List[BrewsRelease], response_model_exclude_none=False)
async def get_brews_releases(publishers: list = Query(["all"]), expired: str = "false"):
    async def get_brews():
        # Get result from the MC_Connection method and check for validity
        #   before sending payload
        query_table = database.get_table("brews")
        if isinstance(query_table, Ok):
            table = query_table.unwrap()
            full_query = (
                table.select()
                .where(table.c.expired == False)
                .order_by(table.c.date_posted.desc())
            )
            if expired.lower() == "false":
                filtered_query = (
                    select(table)
                    .where(
                        (table.c.publisher.in_(publishers)) & (table.c.expired == False)
                    )
                    .order_by(table.c.date_posted.desc())
                )
            else:
                filtered_query = (
                    select(table)
                    .where((table.c.publisher.in_(publishers)))
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


@app.post("/brews/pour", status_code=status.HTTP_201_CREATED)
async def create_brews_release(
    brewsInfo: BrewsRequestInfo,
    response: Response,
    token: str = Depends(token_auth_scheme),
):
    result = VerifyToken(token.credentials).verify()

    if result.get("status"):
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return result

    async def create_brew():
        query_table = database.get_table("brews")
        if isinstance(query_table, Ok):
            table = query_table.unwrap()
            if not await already_saved(brewsInfo, table, database.get_db_obj()):
                query = table.insert().values(
                    headline=brewsInfo.headline,
                    publisher=brewsInfo.publisher,
                    date_posted=datetime.now(pytz.timezone("America/New_York")),
                    expired=False,
                )
                await database.get_db_obj().execute(query)
                search_query = f"SELECT * FROM brews WHERE headline='{brewsInfo.headline}' AND publisher='{brewsInfo.publisher}'"
                newly_created_object = await database.get_db_obj().fetch_all(
                    search_query
                )
                return newly_created_object
            else:
                response.status_code = status.HTTP_208_ALREADY_REPORTED
                return {"status": "already saved"}

        response.status_code = status.HTTP_204_NO_CONTENT
        return {"status": "Not created"}

    query_results = await get_query_results(create_brew)
    return query_results


@app.patch("/brews/refill", status_code=status.HTTP_200_OK)
async def refill_expired_brews_release(
    id: str, response: Response, token: str = Depends(token_auth_scheme)
):
    result = VerifyToken(token.credentials).verify()

    if result.get("status"):
        response.status_code = status.HTTP_400_BAD_REQUEST
        return result

    async def refill_brew():
        query_table = database.get_table("brews")
        if isinstance(query_table, Ok):
            table = query_table.unwrap()
            query = update(table).where(table.c.id == id).values(expired=False)
            await database.get_db_obj().execute(query)
            return {"status": f"refilled"}

        response.status_code = status.HTTP_204_NO_CONTENT
        return {"status": "Not refilled"}

    query_results = await get_query_results(refill_brew)
    return query_results


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
# async def today_stats(response: Response, publishers: list = Query(["all"])):
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


# Utility function to check if a brews release is already saved in the DB
async def already_saved(
    brews_release: BrewsRequestInfo, table: sa.Table, db: Database
) -> bool:
    async def get_result(db, query):
        return await db.execute(query)

    subquery = (
        select(table)
        .exists()
        .where(
            (table.c.headline == brews_release.headline.strip())
            & (table.c.publisher == brews_release.publisher)
        )
    )

    task = asyncio.create_task(
        get_result(db, select(table).where(subquery).scalar_subquery())
    )
    done, pending = await asyncio.wait({task})

    if task in done:
        return False if task.result() == None else True
