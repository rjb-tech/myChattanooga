import logging
import asyncio
from sqlalchemy.sql import select
from fastapi import FastAPI, Query
from database_module import (
    Article,
    Weather, 
    Stat,
    MC_Connection
)
from result import (
    Result,
    Ok,
    Err
)
from typing import (
    List,
    Optional
)


# Configure logger
logging.basicConfig(
    filename='myChattanooga.log',
    filemode='a',
    format='%(asctime)s - %(message)s',
    datefmt='%d-%b-%y %H:%M:%S',
    level=logging.INFO
)

app = FastAPI()
database = MC_Connection()

@app.on_event("startup")
async def startup():
    await database.plug_in()


@app.on_event("shutdown")
async def shutdown():
    await database.unplug()


@app.get("/articles", response_model=List[Article], response_model_exclude_none=True)
async def today_articles(publishers: list = Query(["all"])):
    async def get_articles():
        # Get result from the MC_Connection method and check for validity
        #   before sending payload
        query_table = database.get_table("articles")
        if isinstance(query_table, Ok):
            table = query_table.unwrap()
            full_query = table.select()
            filtered_query = select(table).where(table.c.publisher.in_(publishers))
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

@app.get("/stats", response_model=List[Stat], response_model_exclude_none=True)
async def today_stats():
    async def get_stats():
        # Get result from the MC_Connection method and check for validity
        #   before sending payload
        query_base = database.get_table("stats")
        if isinstance(query_base, Ok):
            full_query = query_base.unwrap().select()
            data = await database.get_db_obj().fetch_all(full_query)
            return [row for row in data]
 
    query_results = await get_query_results(get_stats)
    return query_results


# UTILITY FUNCTION FOR QUERIES
# Handles db connect and disconnect
async def get_query_results(input_async_function):
    if not database.is_connected():
        await database.plug_in()
    if database.is_connected():
        async_results = await input_async_function()
    await database.unplug()
    return async_results