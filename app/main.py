from typing import Optional
from fastapi import FastAPI

app = FastAPI()

@app.get("/articles")
def articles():
    return {"Hello": "World"}