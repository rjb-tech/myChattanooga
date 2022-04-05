from typing import Optional
from fastapi import FastAPI
from . import database
from pydantic import BaseModel

app = FastAPI()

class Article(BaseModel):
    headline: str
    time_posted: str
    publisher: str
    image: str

db = database.Connection("myChattanooga.db")
cursor = db.get_cursor()

@app.get("/articles")
async def articles():
    data = await cursor.execute("Select * FROM articles;")
    return data