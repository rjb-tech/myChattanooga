from lib2to3.pgen2.token import OP
import logging
from typing import Any, Optional
import databases
import sqlalchemy
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
    DATABASE_URL = "sqlite:///./myChattanooga.db"
    db_connection = None
    db_engine = None
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
            self.db_connection = databases.Database(self.DATABASE_URL)
            self.db_engine = sqlalchemy.create_engine(
                self.DATABASE_URL, connect_args={"check_same_thread": False}
            )
            logging.info("database connection established and engine created")
        except Exception as e:
            raise Exception(e)
    
    # Simple getter for the SQLAlchemy Engine
    def get_engine(self) -> Result[sqlalchemy.engine.Engine, str]:
        return Ok(self.db_engine) if self.db_engine else Err('SQLAlchemy engine not available')

    # Get the databases.Database objet
    def get_db_obj(self) -> Result[Any, str]:
        return Ok(self.db_connection) if self.db_connection else Err("SQLite database not available")

    def get_metadata(self) -> sqlalchemy.MetaData:
        return self.local_metadata

    # This is used in create_tables.py
    #   which is run at container build time
    def initialize_tables(self) -> None:
        if self.db_engine:
            self.local_metadata.create_all(self.db_engine)
            logging.info("Database tables initialized")
    
    # Just a simple database connection
    async def plug_in(self) -> None:
        if self.db_connection:
            await self.db_connection.connect()
            logging.info("Database connection opened")
    
    # Disconnect from database and set class variable to None
    #   db_connection also acts as a state check during is_connected()
    async def unplug(self) -> None:
        if self.db_connection:
            await self.db_connection.disconnect()
            self.db_connection = None
            logging.info("Database connection closed")
    
    # Simple utility function
    def is_connected(self) -> None:
        return True if self.db_connection else False

    def get_table(self, classifier: str) -> Result[sqlalchemy.Table, str]:
        try:
            to_return = self.tables[f"{classifier}_table"]
            return Ok(to_return)
        except ValueError as e:
            logging.error(e)
            return Err("table not found")
