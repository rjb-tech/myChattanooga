import os
from uuid import UUID
import logging
from typing import Any, Optional
import sqlalchemy as sa
from datetime import datetime
from sqlalchemy.dialects.postgresql import REAL
from datetime import datetime, date
from pydantic import BaseModel
from databases import Database
from result import Result, Ok, Err

# Configure logger
logging.basicConfig(
    filename="myChattanooga.log",
    filemode="a",
    format="%(asctime)s - %(message)s",
    datefmt="%d-%b-%y %H:%M:%S",
    level=logging.INFO,
)


class Article(BaseModel):
    id: Optional[int]
    headline: Optional[str]
    link: Optional[str]
    image: Optional[str]
    time_posted: Optional[str]
    publisher: Optional[str]
    date_saved: Optional[date]

    class Config:
        orm_mode = True


class Weather(BaseModel):
    weather_location: Optional[str]
    temp: Optional[float]
    humidity: Optional[float]
    weather_code: Optional[int]
    weather_description: Optional[str]
    sunrise: Optional[int]
    sunset: Optional[int]
    wind_speed: Optional[int]
    wind_direction: Optional[str]


class Stat(BaseModel):
    publisher: Optional[str]
    scraped: Optional[int]
    relevant: Optional[int]
    date: Optional[date]

    class Config:
        orm_mode = True


class BrewsRelease(BaseModel):
    headline: str
    id: UUID
    publisher: str
    date_posted: datetime
    expired: bool
    image_url: str
    facebook_profile: str
    instagram_profile: str

    class Config:
        orm_mode = True
        arbitrary_types_allowed = True


class MC_Connection:
    DATABASE_URL = os.environ["DATABASE_URL"]
    db_obj = None
    db_connected = False
    local_metadata = sa.MetaData()
    tables = {}

    tables["articles_table"] = sa.Table(
        "articles",
        local_metadata,
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("headline", sa.Text),
        sa.Column("link", sa.Text),
        sa.Column("image", sa.Text),
        sa.Column("time_posted", sa.Text),
        sa.Column("publisher", sa.Text),
        sa.Column("date_saved", sa.Date),
    )

    tables["stats_table"] = sa.Table(
        "stats",
        local_metadata,
        sa.Column("publisher", sa.Text, primary_key=True),
        sa.Column("scraped", sa.Integer),
        sa.Column("relevant", sa.Integer),
        sa.Column("date", sa.TIMESTAMP),
    )

    tables["tfp_table"] = sa.Table(
        "tfp",
        local_metadata,
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("headline", sa.Text),
        sa.Column("time_posted", sa.TIMESTAMP),
    )

    tables["weather_table"] = sa.Table(
        "weather",
        local_metadata,
        sa.Column("weather_location", sa.String(50), primary_key=True),
        sa.Column("temp", REAL),
        sa.Column("humidity", REAL),
        sa.Column("weather_code", sa.Integer),
        sa.Column("weather_description", sa.Text),
        sa.Column("sunrise", sa.Integer),
        sa.Column("sunset", sa.Integer),
        sa.Column("wind_speed", sa.Integer),
        sa.Column("wind_direction", sa.Integer),
    )

    tables["brews_table"] = sa.Table(
        "brews",
        local_metadata,
        sa.Column("headline", sa.Text, primary_key=True),
        sa.Column("id", sa.dialects.postgresql.UUID(as_uuid=True)),
        sa.Column("publisher", sa.String(256)),
        sa.Column("date_posted", sa.TIMESTAMP),
        sa.Column("expired", sa.Boolean),
        sa.Column("image_url", sa.Text),
        sa.Column("facebook_profile", sa.Text),
        sa.Column("instagram_profile", sa.Text),
    )

    # Constructor
    def __init__(self) -> None:
        try:
            self.db_obj = Database(self.DATABASE_URL, statement_cache_size=0)
            logging.info("Database object created")
        except Exception as e:
            raise Exception(e)

    def get_metadata(self) -> sa.MetaData:
        return self.local_metadata

    # Plug in, connect if needed, return existing attribute if it exists
    async def plug_in(self) -> None:
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

    def get_table(self, classifier: str) -> Result[sa.Table, str]:
        try:
            to_return = self.tables[f"{classifier}_table"]
            return Ok(to_return)
        except ValueError as e:
            logging.error(e)
            return Err("table not found")

    def get_db_obj(self):
        if self.db_connected:
            return self.db_obj
        else:
            raise ConnectionError
