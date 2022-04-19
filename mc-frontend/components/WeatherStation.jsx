import { useEffect, useState } from 'react'
import '../node_modules/weather-react-icons/lib/css/weather-icons.css'
import { WeatherIcon } from 'weather-react-icons'

const locations = {
    airport: {
        latitude: 35.037384,
        longitude: -85.196596
    },
    coolidgePark: {
        latitude: 35.060666,
        longitude: -85.307835
    },
    downtown : {
        latitude: 35.055072,
        longitude: -85.311388
    },
    eastBrainerd: {
        latitude: 35.035135,
        longitude: -85.156978
    },
    eastRidge: {
        latitude: 34.991181,
        longitude: -85.229127
    },
    hixson: {
        latitude: 35.130611,
        longitude: -85.241446
    },
    lookoutMountain: {
        latitude: 35.019072,
        longitude: -85.339596
    },
    northChattanooga: {
        latitude: 35.069496,
        longitude: -85.289329
    },
    redBank: {
        latitude: 35.110136,
        longitude: -85.295099
    },
    southside: {
        latitude: 35.037511,
        longitude: -85.307215
    }
}

export const WeatherStation = ({ isNight }) => {

    const [ currentLocation, setCurrentLocation ] = useState('hixson');

    // Source: https://sherryhsu.medium.com/react-async-data-fetch-f5ccb107d02b
    useEffect(() => {
        const fetchData = async () => {
            const latitude = locations[`${currentLocation}`]['latitude'];
            const longitude = locations[`${currentLocation}`]['longitude'];
            // make a weather api route for this to hide api key
            const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${process.env.openWeatherAPIKey}&units=imperial`);
            const newData = await response.json();
        };

        fetchData();
    }, [])

    return (
        <div className=''>
            <WeatherIcon iconId={200} name="owm" night={isNight} className="h-64" />
        </div>
    )
}