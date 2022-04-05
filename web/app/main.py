from typing import Optional
from fastapi import FastAPI
import database
from pydantic import BaseModel
from databases import Database

app = FastAPI()
db = Database("sqlite://myChattanooga.db")
db.connect()

class Article(BaseModel):
    headline: str
    time_posted: str
    publisher: str
    image: str

# db = database.Connection("myChattanooga.db")
# cursor = db.get_cursor()

@app.get("/articles")
async def articles():
    query = "Select * FROM articles;"
    data = await db.execute(query)
    return data