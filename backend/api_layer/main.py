import logging
import asyncio

from fastapi import FastAPI
from database_module import (
    Article, 
    Stat,
    MC_Connection
)
from result import (
    Result,
    Ok,
    Err
)
from typing import (
    List
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


@app.get("/articles", response_model=List[Article])
async def today_articles():
    async def get_articles(conn):
        # Get result from the MC_Connection method and check for validity
        #   before sending payload
        query_base = database.get_table("articles")
        if isinstance(query_base, Ok):
            full_query = query_base.unwrap().select()
            return await database.get_db_obj().fetch_all(full_query)
    
    query_results = get_query_results(get_articles)
    return await asyncio.gather(query_results)


@app.get("/stats")
async def today_stats():
    async def get_stats(conn):
        # Get result from the MC_Connection method and check for validity
        #   before sending payload
        query_base = database.get_table("stats")
        if isinstance(query_base, Ok):
            full_query = query_base.unwrap().select()
            return await database.get_db_obj().fetch_all(full_query)
 
    query_results = get_query_results(get_stats)
    return await asyncio.gather(query_results)


async def get_query_results(input_async_function):
    if not database.is_connected():
        await startup()
    if database.is_connected():
        query_results = input_async_function(database)
        query_results = await asyncio.gather(query_results)
        return query_results 
    await shutdown()