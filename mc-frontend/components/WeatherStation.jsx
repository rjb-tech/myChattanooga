import { useEffect, useState } from 'react'
import ReactWeather, { useOpenWeather } from 'react-open-weather'

const locations = {
    airport: {
        latitude: 35.037384,
        longitude: -85.196596,
        name: "Airport"
    },
    coolidgePark: {
        latitude: 35.060666,
        longitude: -85.307835,
        name: "Coolidge Park"
    },
    downtownAquarium : {
        latitude: 35.055072,
        longitude: -85.311388,
        name: "Downtown (Aquarium)"
    },
    eastBrainerd: {
        latitude: 35.035135,
        longitude: -85.156978,
        name: "East Brainerd"
    },
    eastRidge: {
        latitude: 34.991181,
        longitude: -85.229127,
        name: "East Ridge"
    },
    hixson: {
        latitude: 35.130611,
        longitude: -85.241446,
        name: "Hixson"
    },
    lookoutMountain: {
        latitude: 35.019072,
        longitude: -85.339596,
        name: "Lookout Mountain"
    },
    northChattanooga: {
        latitude: 35.069496,
        longitude: -85.289329,
        name: "North Chattanooga"
    },
    redBank: {
        latitude: 35.110136,
        longitude: -85.295099,
        name: "Red Bank"
    },
    southside: {
        latitude: 35.037511,
        longitude: -85.307215,
        name: "Southside"
    }
}

export const WeatherStation = ({ isNight }) => {

    const [ currentLocation, setCurrentLocation ] = useState('northChattanooga');
    const [ currentTemp, setCurrentTemp ] = useState(null)
    const [ currentIcon, setCurrentIcon ] = useState(null)

    Source: https://sherryhsu.medium.com/react-async-data-fetch-f5ccb107d02b
    useEffect(() => {
        const fetchData = async () => {
            const latitude = locations[`${currentLocation}`]['latitude'];
            const longitude = locations[`${currentLocation}`]['longitude'];
            const response = await fetch(`/api/weather?latitude=${latitude}&longitude=${longitude}`);
            const data = await response.json()
            
            setCurrentTemp(data.current.temp.toFixed())
            setCurrentIcon(data.current.weather[0].icon)
        };

        fetchData();
    }, [])

    return (
        <div className='flex-col mx-auto h-full'>
            <Image src={`http://openweathermap.org/img/wn/${currentIcon}@2x.png`} />
        </div>
    )
}