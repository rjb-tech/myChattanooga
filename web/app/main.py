import logging
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
    print("Database connected!")


@app.on_event("shutdown")
async def shutdown():
    await database.unplug()
    print("Database disconnected!")


@app.get("/articles", response_model=List[Article])
async def today_articles():
    # Get result from the class method and check for validity
    #   before sending payload
    query_base = database.get_table("articles")
    if isinstance(query_base, Ok):
        full_query = query_base.unwrap().select()
        db_conn = database.get_db_obj()
        if isinstance(db_conn, Ok):
            return await db_conn.unwrap().fetch_all(full_query)
    
    # Return empty list if nothing found
    return []


@app.get("/stats", response_model=List[Stat])
async def today_stats():
    # Get result from the class method and check for validity
    #   before sending payload
    query_base = database.get_table("stats")
    if isinstance(query_base, Ok):
        full_query = query_base.unwrap().select()
        db_conn = database.get_db_obj()
        if isinstance(db_conn, Ok):
            return await db_conn.unwrap().fetch_all(full_query)
    
    # Return empty list if nothing found
    return []