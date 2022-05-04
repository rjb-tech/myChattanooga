import { useEffect, useState } from 'react'
import { ReactSkycon, SkyconType } from 'react-skycons-extended';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
const axios = require('axios');

export const WeatherStation = ({ isDark }) => {

    // https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
    // https://www.npmjs.com/package/react-skycons-extended
    const weatherCodeMappings = {
        "default": {
            "name": "default state",
            "day": 0,
            "night": 0
        },
        "200": {    
            "name": "thunderstorm with light rain",
            "day": SkyconType.THUNDER_RAIN,
            "night": SkyconType.THUNDER_RAIN
        },
        "201": {
            "name": "thunderstorm with rain",
            "day": SkyconType.THUNDER_RAIN,
            "night": SkyconType.THUNDER_RAIN
        },
        "202": {
            "name": "thunderstorm with heavy rain",
            "day": SkyconType.THUNDER_RAIN,
            "night": SkyconType.THUNDER_RAIN
        },
        "210": {
            "name": "light thunderstorm",
            "day": SkyconType.THUNDER_RAIN,
            "night": SkyconType.THUNDER_RAIN
        },
        "211": {
            "name": "thunderstorm",
            "day": SkyconType.THUNDER_RAIN,
            "night": SkyconType.THUNDER_RAIN
        },
        "212": {
            "name": "heavy thunderstorm",
            "day": SkyconType.THUNDER_RAIN,
            "night": SkyconType.THUNDER_RAIN
        },
        "221": {
            "name": "ragged thunderstorm",
            "day": SkyconType.THUNDER_RAIN,
            "night": SkyconType.THUNDER_RAIN
        },
        "230": {
            "name": "thunderstorm with light drizzle",
            "day": SkyconType.THUNDER_RAIN,
            "night": SkyconType.THUNDER_RAIN
        },
        "231": {
            "name": "thunderstorm with drizzle",
            "day": SkyconType.THUNDER_RAIN,
            "night": SkyconType.THUNDER_RAIN
        },
        "232": {
            "name": "thunderstorm with heavy drizzle",
            "day": SkyconType.THUNDER_RAIN,
            "night": SkyconType.THUNDER_RAIN
        },
        "300": {
            "name": "light intensity drizzle",
            "day": SkyconType.SHOWERS_DAY,
            "night": SkyconType.SHOWERS_NIGHT
        },
        "301": {
            "name": "drizzle",
            "day": SkyconType.SHOWERS_DAY,
            "night": SkyconType.SHOWERS_NIGHT
        },
        "302": {
            "name": "heavy intensity drizzle",
            "day": SkyconType.SHOWERS_DAY,
            "night": SkyconType.SHOWERS_NIGHT
        },
        "310": {
            "name": "light intensity drizzle rain",
            "day": SkyconType.SHOWERS_DAY,
            "night": SkyconType.SHOWERS_NIGHT
        },
        "311": {
            "name": "drizzle rain",
            "day": SkyconType.RAIN,
            "night": SkyconType.RAIN
        },
        "312": {
            "name": "heavy intensity drizzle rain",
            "day": SkyconType.RAIN,
            "night": SkyconType.RAIN
        },
        "313": {
            "name": "shower rain and drizzle",
            "day": SkyconType.RAIN,
            "night": SkyconType.RAIN
        },
        "314": {
            "name": "heavy shower rain and drizzle",
            "day": SkyconType.RAIN,
            "night": SkyconType.RAIN
        },
        "321": {
            "name": "shower drizzle",
            "day": SkyconType.RAIN,
            "night": SkyconType.RAIN
        },
        "500": {
            "name": "light rain",
            "day": SkyconType.RAIN,
            "night": SkyconType.RAIN
        },
        "501": {
            "name": "moderate rain",
            "day": SkyconType.RAIN,
            "night": SkyconType.RAIN
        },
        "502": {
            "name": "heavy intensity rain",
            "day": SkyconType.RAIN,
            "night": SkyconType.RAIN
        },
        "503": {
            "name": "very heavy rain",
            "day": SkyconType.RAIN,
            "night": SkyconType.RAIN
        },
        "504": {
            "name": "extreme rain",
            "day": SkyconType.RAIN,
            "night": SkyconType.RAIN
        },
        "511": {
            "name": "freezing rain",
            "day": SkyconType.SLEET,
            "night": SkyconType.SLEET
        },
        "520": {
            "name": "light intensity shower rain",
            "day": SkyconType.SHOWERS_DAY,
            "night": SkyconType.SHOWERS_NIGHT
        },
        "521": {
            "name": "shower rain",
            "day": SkyconType.SHOWERS_DAY,
            "night": SkyconType.SHOWERS_NIGHT
        },
        "522": {
            "name": "heavy intensity shower rain",
            "day": SkyconType.RAIN,
            "night": SkyconType.RAIN
        },
        "531": {
            "name": "ragged shower rain",
            "day": SkyconType.RAIN,
            "night": SkyconType.RAIN
        },
        "600": {
            "name": "light snow",
            "day": SkyconType.SNOW,
            "night": SkyconType.SNOW
        },
        "601": {
            "name": SkyconType.SNOW,
            "day": SkyconType.SNOW,
            "night": SkyconType.SNOW 
        },
        "602": {
            "name": "heavy snow",
            "day": SkyconType.SNOW,
            "night": SkyconType.SNOW
        },
        "611": {
            "name": SkyconType.SLEET,
            "day": SkyconType.SLEET,
            "night": SkyconType.SLEET
        },
        "612": {
            "name": "light shower sleet",
            "day": SkyconType.RAIN_SNOW,
            "night": SkyconType.RAIN_SNOW
        },
        "613": {
            "name": "shower sleet",
            "day": SkyconType.RAIN_SNOW,
            "night": SkyconType.RAIN_SNOW
        },
        "615": {
            "name": "light rain and snow",
            "day": SkyconType.RAIN_SNOW,
            "night": SkyconType.RAIN_SNOW
        },
        "616": {
            "name": "rain and snow",
            "day": SkyconType.RAIN_SNOW,
            "night": SkyconType.RAIN_SNOW
        },
        "620": {
            "name": "light shower snow",
            "day": SkyconType.RAIN_SNOW,
            "night": SkyconType.RAIN_SNOW
        },
        "621": {
            "name": "shower snow",
            "day": SkyconType.RAIN_SNOW,
            "night": SkyconType.RAIN_SNOW
        },
        "622": {
            "name": "heavy shower snow",
            "day": SkyconType.RAIN_SNOW,
            "night": SkyconType.RAIN_SNOW
        },
        "701": {
            "name": "mist",
            "day": SkyconType.FOG,
            "night": SkyconType.FOG
        },
        "711": {
            "name": "smoke",
            "day": SkyconType.FOG,
            "night": SkyconType.FOG
        },
        "721": {
            "name": "haze",
            "day": SkyconType.FOG,
            "night": SkyconType.FOG
        },
        "731": {
            "name": "sand/dust whirls",
            "day": SkyconType.WIND,
            "night": SkyconType.WIND
        },
        "741": {
            "name": SkyconType.FOG,
            "day": SkyconType.FOG,
            "night": SkyconType.FOG
        },
        "751": {
            "name": "sand",
            "day": SkyconType.FOG,
            "night": SkyconType.FOG
        },
        "761": {
            "name": "dust",
            "day": SkyconType.FOG,
            "night": SkyconType.FOG
        },
        "762": {
            "name": "volcanic ash",
            "day": SkyconType.FOG,
            "night": SkyconType.FOG
        },
        "771": {
            "name": "sqalls",
            "day": SkyconType.FOG,
            "night": SkyconType.FOG
        },
        "781": {
            "name": "tornado",
            "day": SkyconType.THUNDER_RAIN,
            "night": SkyconType.THUNDER_RAIN
        },
        "800": {
            "name": "clear",
            "day": SkyconType.CLEAR_DAY,
            "night": SkyconType.CLEAR_NIGHT
        },
        // THIS WILL NEED ADDITIONAL LOGIC SOMEWHERE TO CHANGE RAIN ICONS BASED ON CLOUD COVERAGE
        "801": {
            "name": "few clouds: 11-25%",
            "day": SkyconType.PARTLY_CLOUDY_DAY,
            "night": SkyconType.PARTLY_CLOUDY_NIGHT
        },
        "802": {
            "name": "scattered clouds: 25-50%",
            "day": SkyconType.PARTLY_CLOUDY_DAY,
            "night": SkyconType.PARTLY_CLOUDY_NIGHT
        },
        "803": {
            "name": "broken clouds: 51-84%",
            "day": SkyconType.PARTLY_CLOUDY_DAY,
            "night": SkyconType.PARTLY_CLOUDY_NIGHT
        },
        "804": {
            "name": "overcast cloud: 85-100%",
            "day": SkyconType.CLOUDY,
            "night": SkyconType.CLOUDY
        }
    }

    const locations = {
        airport: {
            latitude: 35.037384,
            longitude: -85.196596,
            "name": "Airport"
        },
        coolidgePark: {
            latitude: 35.060666,
            longitude: -85.307835,
            "name": "Coolidge Park"
        },
        downtownAquarium : {
            latitude: 35.055072,
            longitude: -85.311388,
            "name": "Downtown (Aquarium)"
        },
        eastBrainerd: {
            latitude: 35.035135,
            longitude: -85.156978,
            "name": "East Brainerd"
        },
        eastRidge: {
            latitude: 34.991181,
            longitude: -85.229127,
            "name": "East Ridge"
        },
        harrison: {
            latitude: 35.114548,
            longitude: -85.138063,
            "name": "Harrison"
        },
        hixson: {
            latitude: 35.130611,
            longitude: -85.241446,
            "name": "Hixson"
        },
        // lookoutMountain: {
        //     latitude: 35.019072,
        //     longitude: -85.339596,
        //     "name": "Lookout Mountain"
        // },
        northChattanooga: {
            latitude: 35.069496,
            longitude: -85.289329,
            "name": "North Chattanooga"
        },
        redBank: {
            latitude: 35.110136,
            longitude: -85.295099,
            "name": "Red Bank"
        },
        signalMountain: {
            latitude: 35.142164,
            longitude: -85.342200,
            "name": "Signal Mountain"
        },
        soddyDaisy: {
            latitude: 35.237057, 
            longitude: -85.183266,
            "name": "Soddy Daisy"
        },
        southside: {
            latitude: 35.037511,
            longitude: -85.307215,
            "name": "Southside"
        }
    }

    const locationsIterHelper = Object.keys(locations)

    // The sunrise and sunset
    function isDay(sunrise, sunset) {
        const currentDate = new Date();
        const now = currentDate.getTime() / 1000;

        return now > sunrise && now < sunset ? true : false;
    }

    const [ currentLocation, setCurrentLocation ] = useState('northChattanooga');
    const [ currentTemp, setCurrentTemp ] = useState("");
    const [ currentWeatherCode, setCurrentWeatherCode ] = useState("default");
    const [ weatherDescription, setWeatherDescription ] = useState("");
    const [ currentSunrise, setCurrentSunrise ] = useState(0);
    const [ currentSunset, setCurrentSunset ] = useState(0);
    const [ currentHumidity, setCurrentHumidity ] = useState(0);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ windSpeed, setWindSpeed ] = useState(0);
    const [ windDirectionInDegrees, setWindDirectionInDegrees ] = useState(0);

    // Source: https://sherryhsu.medium.com/react-async-data-fetch-f5ccb107d02b
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const response = await axios.get(`/api/weather?location=${locations[currentLocation]['name']}`)
            .catch(function(error) {
                console.log(error);
            })
            const data = await response.data[0]
            
            setCurrentTemp(data["temp"].toFixed());
            setCurrentWeatherCode(data["weather_code"]);
            setWeatherDescription(data["weather_description"]);
            setCurrentSunrise(data["sunrise"]);
            setCurrentSunset(data["sunset"]);
            setCurrentHumidity(data["humidity"]);
            setWindSpeed(data["wind_speed"]);
            setWindDirectionInDegrees(data["wind_direction"]);
            setIsLoading(false);
        };

        fetchData();
    }, [currentLocation])

    const weatherConfig = {
        icon: isDay(currentSunrise, currentSunset)===true
                ? SkyconType[weatherCodeMappings[currentWeatherCode].day] 
                : SkyconType[weatherCodeMappings[currentWeatherCode].night],
        size: 100,
        animate: true,
        color: isDark===true ? '#FFF' : '#222'
    }

    const switchWeatherLocation = (increasing) => {
        if (increasing===true) {
            const index = locationsIterHelper.indexOf(currentLocation) + 1;
            if (index > locationsIterHelper.length - 1) {
                // set index to 0 if the max length of the locations list is reached
                index = 0;
            }
            const newLocation = locationsIterHelper[index];
            setCurrentLocation(newLocation);
            // save to localstorage here
        }
        else {
            const index = locationsIterHelper.indexOf(currentLocation) - 1;
            if (index < 0) {
                // Get last items if the index counter goes under 0
                index = locationsIterHelper.length - 1;
            }
            const newLocation = locationsIterHelper[index];
            setCurrentLocation(newLocation);
            // save to localstorage here
        }
    }

    return (
        <div className='w-10/12 md:w-5/6 mx-auto'>
            <div className='flex-col w-full h-fit'>
                <div className='flex place-items-center'>
                    <motion.button whileTap={{ scale: 0.8 }} className='w-1/12 h-full flex-auto' onClick={() => switchWeatherLocation(false)}>
                        <FontAwesomeIcon icon={faAngleLeft} style={{color: `${weatherConfig.color}`}} className='w-1/2 h-1/2 md:w-1/3 md:h-1/3 xl:w-1/5 xl:h-1/5 flex-auto mx-auto'/>
                    </motion.button>
                    <div className='flex-auto text-2xl md:text-xl xl:text-3xl text-center font-bold pb-2 sm:pt-2 w-5/6 md:w-4/6'>
                        {locations[`${currentLocation}`].name}
                    </div>
                    <motion.button whileTap={{ scale: 0.8 }} className='w-1/12 h-full flex-auto' onClick={() => switchWeatherLocation(true)}>
                        <FontAwesomeIcon icon={faAngleRight} style={{color: `${weatherConfig.color}`}} className='w-1/2 h-1/2 md:w-1/3 md:h-1/3 xl:w-1/5 xl:h-1/5 flex-auto mx-auto'/>
                    </motion.button>
                </div>
                <div className='flex w-full'>
                    <div className='flex w-full'>
                        <div className='w-1/2 flex-auto flex justify-end items-center'>
                            <ReactSkycon 
                                className='w-fit h-fit'
                                icon={weatherConfig.icon}
                                size={weatherConfig.size}
                                animate={weatherConfig.animate}
                                color={weatherConfig.color}
                            />                        
                        </div>
                        <div className='w-1/2 container pl-4'>
                            <div className='justify-start flex text-center text-5xl md:text-3xl'>
                                {currentTemp}<p className='text-2xl mt-1 text-left'>&#176;F</p>
                            </div>
                             <p className='text-lg md:text-base justify-center py-2 text-left italic'>
                                {weatherDescription}
                            </p>
                            <p className='text-base md:text-sm justify-center text-left'>
                                {currentHumidity}% Humidity
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}