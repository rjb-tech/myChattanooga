import os
import asyncio
import requests
import sqlalchemy
from sqlalchemy.dialects.postgresql import insert
import datetime
from database_module import MC_Connection, Article
from result import Ok, Err, Result

locations = {
    "airport": {"latitude": 35.037384, "longitude": -85.196596, "name": "Airport"},
    "coolidge_park": {
        "latitude": 35.060666,
        "longitude": -85.307835,
        "name": "Coolidge Park",
    },
    "downtown": {"latitude": 35.055072, "longitude": -85.311388, "name": "Downtown"},
    "east_brainerd": {
        "latitude": 35.035135,
        "longitude": -85.156978,
        "name": "East Brainerd",
    },
    "east_ridge": {
        "latitude": 34.991181,
        "longitude": -85.229127,
        "name": "East Ridge",
    },
    "harrison": {"latitude": 35.114548, "longitude": -85.138063, "name": "Harrison"},
    "hixson": {"latitude": 35.130611, "longitude": -85.241446, "name": "Hixson"},
    "north_chattanooga": {
        "latitude": 35.069496,
        "longitude": -85.289329,
        "name": "North Chattanooga",
    },
    "red_bank": {"latitude": 35.110136, "longitude": -85.295099, "name": "Red Bank"},
    "signal_mountain": {
        "latitude": 35.142164,
        "longitude": -85.342200,
        "name": "Signal Mountain",
    },
    "soddy_daisy": {
        "latitude": 35.237057,
        "longitude": -85.183266,
        "name": "Soddy Daisy",
    },
    "southside": {"latitude": 35.037511, "longitude": -85.307215, "name": "Southside"},
}


# https://gist.github.com/RobertSudwarts/acf8df23a16afdb5837f
def degrees_to_cardinal(degrees: int):
    dirs = [
        "N",
        "NNE",
        "NE",
        "ENE",
        "E",
        "ESE",
        "SE",
        "SSE",
        "S",
        "SSW",
        "SW",
        "WSW",
        "W",
        "WNW",
        "NW",
        "NNW",
    ]
    ix = round(degrees / (360.0 / len(dirs)))
    return dirs[ix % len(dirs)]


async def main():
    db_conn = MC_Connection()
    weather_table = db_conn.get_table("weather").unwrap()
    task = asyncio.create_task(db_conn.plug_in())
    done, pending = await asyncio.wait({task})
    if task in done:
        db_object = db_conn.get_db_obj()
        try:
            for location_key in locations:
                current_location = locations[location_key]
                print("Scraping " + current_location["name"] + " weather")
                current_endpoint = f"https://api.openweathermap.org/data/2.5/weather?lat={current_location['latitude']}&lon={current_location['longitude']}&appid={os.environ['OWM_API_KEY']}&units=imperial"
                current_weather_data = requests.get(current_endpoint).json()
                # Put in db here
                insert_values = {
                    "weather_location": current_location["name"],
                    "temp": current_weather_data["main"]["temp"],
                    "humidity": current_weather_data["main"]["humidity"],
                    "weather_code": current_weather_data["weather"][0]["id"],
                    "weather_description": current_weather_data["weather"][0][
                        "description"
                    ],
                    "sunrise": current_weather_data["sys"]["sunrise"],
                    "sunset": current_weather_data["sys"]["sunset"],
                    "wind_speed": current_weather_data["wind"]["speed"],
                    "wind_direction": degrees_to_cardinal(
                        current_weather_data["wind"]["deg"]
                    ),
                }
                stmt = insert(weather_table).values(
                    weather_location=insert_values["weather_location"],
                    temp=insert_values["temp"],
                    humidity=insert_values["humidity"],
                    weather_code=insert_values["weather_code"],
                    weather_description=insert_values["weather_description"],
                    sunrise=insert_values["sunrise"],
                    sunset=insert_values["sunset"],
                    wind_speed=insert_values["wind_speed"],
                    wind_direction=insert_values["wind_direction"],
                )
                stmt = stmt.on_conflict_do_update(
                    index_elements=["weather_location"], set_=insert_values
                )
                await db_object.execute(stmt)
        except Exception as e:
            print("Exception caught: ", end="")
            print(e)
        finally:
            # Close db connection
            await db_conn.unplug()


if __name__ == "__main__":
    asyncio.run(main())
