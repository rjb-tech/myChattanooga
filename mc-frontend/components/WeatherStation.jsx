import { useEffect, useState } from 'react'
import '../node_modules/weather-react-icons/lib/css/weather-icons.css'
import { WeatherIcon } from 'weather-react-icons'
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
};

// https://www.npmjs.com/package/react-open-weather
const customWeatherStyles = {
	fontFamily:  'Helvetica, sans-serif',
	gradientStart:  '#0181C2',
	gradientMid:  '#04A7F9',
	gradientEnd:  '#4BC4F7',
	locationFontColor:  '#FFF',
	todayTempFontColor:  '#FFF',
	todayDateFontColor:  '#B5DEF4',
	todayRangeFontColor:  '#B5DEF4',
	todayDescFontColor:  '#B5DEF4',
	todayInfoFontColor:  '#B5DEF4',
	todayIconColor:  '#FFF',
};

export const WeatherStation = ({ isNight }) => {

    const [ currentLocation, setCurrentLocation ] = useState('northChattanooga');
    const { data, isLoading, errorMessage } = useOpenWeather({
        key: "54b7e61f7e7116f117b557cf2ba4c59f", // This needs to be stored securely somehow idk yet
        lat: locations[`${currentLocation}`]['latitude'],
        lon: locations[`${currentLocation}`]['latitude'],
        lang: 'en',
        unit: 'imperial', // values are (metric, standard, imperial)
    });

    return (
        <div className='flex-col mx-auto h-full'>
            <ReactWeather
                theme={customWeatherStyles}
                isLoading={isLoading}
                errorMessage={errorMessage}
                data={data}
                lang="en"
                locationLabel={locations[`${currentLocation}`].name}
                unitsLabels={{ temperature: 'F', windSpeed: 'mph' }}
                showForecast={false}
            />
        </div>
    )
}