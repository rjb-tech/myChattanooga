import os
import logging
from typing import Any, Optional
import databases
import sqlalchemy
from sqlalchemy.pool import QueuePool
from datetime import datetime
from pydantic import BaseModel
from databases import Database
from result import (
    Result,
    Ok,
    Err
)

# Configure logger
logging.basicConfig(
    filename='myChattanooga.log',
    filemode='a',
    format='%(asctime)s - %(message)s',
    datefmt='%d-%b-%y %H:%M:%S',
    level=logging.INFO
)


class Article(BaseModel):
    id: Optional[int]
    headline: str
    link: str
    image: str
    time_posted: str
    publisher: str


class Stat(BaseModel):
    publisher: str
    scraped: int
    relevant: int
    date: datetime


class MC_Connection:
    DATABASE_URL = "postgresql://" + os.environ['POSTGRES_USER'] + ":" + os.environ['POSTGRES_PASSWORD'] + "@host.docker.internal:5432"

    db_obj = None
    db_connected = False
    local_metadata = sqlalchemy.MetaData()
    tables = {}
    
    tables["articles_table"] = sqlalchemy.Table(
        "articles",
        local_metadata,
        sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
        sqlalchemy.Column("headline", sqlalchemy.Text),
        sqlalchemy.Column("link", sqlalchemy.Text),
        sqlalchemy.Column("image", sqlalchemy.Text),
        sqlalchemy.Column("time_posted", sqlalchemy.Text),
        sqlalchemy.Column("publisher", sqlalchemy.Text),
    )

    tables["stats_table"] = sqlalchemy.Table(
        "stats",
        local_metadata,
        sqlalchemy.Column("publisher", sqlalchemy.Text, primary_key=True),
        sqlalchemy.Column("scraped", sqlalchemy.Integer),
        sqlalchemy.Column("relevant", sqlalchemy.Integer),
        sqlalchemy.Column("date", sqlalchemy.TIMESTAMP),
    )

    tables["tfp_table"] = sqlalchemy.Table(
        "tfp",
        local_metadata,
        sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
        sqlalchemy.Column("headline", sqlalchemy.Text),
        sqlalchemy.Column("time_posted", sqlalchemy.TIMESTAMP)
    )    
    
    # Constructor
    def __init__(self) -> None:
        try:
            self.db_obj = Database(self.DATABASE_URL)
            logging.info("Database object created")
        except Exception as e:
            raise Exception(e)
    

    def get_metadata(self) -> sqlalchemy.MetaData:
        return self.local_metadata
    
    # Plug in, connect if needed, return existing attribute if it exists
    async def plug_in(self):
        if not self.db_connected:
            await self.db_obj.connect()
            self.db_connected = True
             
    # Disconnect from database and set class variable to None
    #   db_connection also acts as a state check during is_connected()
    async def unplug(self) -> None:
        if self.db_connected:
            await self.db_obj.disconnect()
            self.db_connected = False
    
    # Simple utility function
    def is_connected(self) -> bool:
        return self.db_connected

    def get_table(self, classifier: str) -> Result[sqlalchemy.Table, str]:
        try:
            to_return = self.tables[f"{classifier}_table"]
            return Ok(to_return)
        except ValueError as e:
            logging.error(e)
            return Err("table not found")

    def get_db_obj(self):
        if self.db_connected:
            return self.db_obj
        