import os
import requests
import sqlalchemy
from datetime import datetime
from database_module import (
    MC_Connection,
    Article
)
from result import (
    Ok,
    Err,
    Result
)

locations = {
    "airport": {
        "latitude": 35.037384,
        "longitude": -85.196596,
        "name": "Airport"
    },
    "coolidge_park": {
        "latitude": 35.060666,
        "longitude": -85.307835,
        "name": "Coolidge Park"
    },
    "downtown_aquarium" : {
        "latitude": 35.055072,
        "longitude": -85.311388,
        "name": "Downtown (Aquarium)"
    },
    "east_brainerd": {
        "latitude": 35.035135,
        "longitude": -85.156978,
        "name": "East Brainerd"
    },
    "east_ridge": {
        "latitude": 34.991181,
        "longitude": -85.229127,
        "name": "East Ridge"
    },
    "harrison": {
        "latitude": 35.114548,
        "longitude": -85.138063,
        "name": "Harrison"
    },
    "hixson": {
        "latitude": 35.130611,
        "longitude": -85.241446,
        "name": "Hixson"
    },
    "north_chattanooga": {
        "latitude": 35.069496,
        "longitude": -85.289329,
        "name": "North Chattanooga"
    },
    "red_bank": {
        "latitude": 35.110136,
        "longitude": -85.295099,
        "name": "Red Bank"
    },
    "signal_mountain": {
        "latitude": 35.142164,
        "longitude": -85.342200,
        "name": "Signal Mountain"
    },
    "soddy_daisy": {
        "latitude": 35.237057, 
        "longitude": -85.183266,
        "name": "Soddy Daisy"
    },
    "southside": {
        "latitude": 35.037511,
        "longitude": -85.307215,
        "name": "Southside"
    }
}

def main():
    for location in locations:
        weather_url = f"https://api.openweathermap.org/data/2.5/weather?lat={location['latitude']}&lon={location['longitude']}&appid={os.environ['OWM_API_KEY']}&units=imperial"
        data = requests.get(weather_url)
        # Put in db here

print("Hi from the weather scraper :)")