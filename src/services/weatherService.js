const axios = require('axios');
const Weather = require('../models/Weather');
const cacheService = require('./cacheService');
const logger = require('../utils/logger');

class WeatherService {
    constructor () {
        this.apiKey = process.env.OPENWEATHER_API_KEY;
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    }

    /*
        Weather API Response Structure (Example: OpenWeatherMap for Ho Chi Minh City)

        coord:       // Geographic coordinates of the city
            - lon:     Longitude
            - lat:     Latitude

        weather:     // Weather conditions (array, usually with one object)
            - id:      Weather condition ID (useful for mapping icons)
            - main:    Short description (e.g., "Clear", "Rain", "Clouds")
            - description: More detailed weather condition (e.g., "clear sky")
            - icon:    Icon code (can be used to load weather icons)

        base:        // Internal data source (usually "stations")

        main:        // Main atmospheric data
            - temp:        Current temperature in Kelvin
            - feels_like:  How it feels like (Kelvin)
            - temp_min:    Minimum observed temperature
            - temp_max:    Maximum observed temperature
            - pressure:    Atmospheric pressure at sea level (hPa)
            - humidity:    Humidity percentage
            - sea_level:   Sea level pressure (optional)
            - grnd_level:  Ground level pressure (optional)

        visibility:  // Visibility distance in meters

        wind:        // Wind conditions
            - speed:   Wind speed in m/s
            - deg:     Wind direction in degrees (meteorological)

        clouds:      // Cloudiness percentage
            - all:     0 means clear, 100 means fully overcast

        dt:          // Time of data calculation (UNIX timestamp in UTC)

        sys:         // System info
            - type, id: Internal metadata
            - country: Country code (e.g., "VN")
            - sunrise: Sunrise time (UNIX timestamp in UTC)
            - sunset:  Sunset time (UNIX timestamp in UTC)

        timezone:    // Shift in seconds from UTC (e.g., 25200 = UTC+7)

        id:          // City ID (can be used to fetch weather again)
        name:        // City name (e.g., "Ho Chi Minh City")
        cod:         // Response code (200 means OK)
    */
   
    async getCurrentWeather(city, units = 'metric') {
        try {
            // Check cache first
            const cached = await cacheService.get(`weather:${city}-metric:${units}`);
            if (cached) {
                // logger.info(`Cached hit for ${city}`);
                return cached;
            }
            
            // Fetch from API
            const response = await axios.get(`${this.baseUrl}/weather`, {
                params: {
                    q: city,
                    appid: this.apiKey,
                    units: units
                }
            });


            if (response.status !== 200) {
                throw new Error(`Failed to fetch weather data: ${response.statusText}`);
            }

            // logger.info('Data: ', response.data);

            const weatherData = new Weather({
                city: response.data.name,
                description: response.data.weather[0].description,
                icon: response.data.weather[0].icon,
                temperature: response.data.main.temp,
                feels_like: response.data.main.feels_like,
                temp_min: response.data.main.temp_min,
                temp_max: response.data.main.temp_max,
                humidity: response.data.main.humidity,
                pressure: response.data.main.pressure,
                windDeg: response.data.wind.deg ?? 'N/A',
                windSpeed: response.data.wind.speed,
            });
            
            // Cache for 10 minutes
            cacheService.set(`weather:${city}-metric:${units}`, weatherData, 600);
            // logger.info(`Weather data fetched for ${city}`);
            return weatherData;
        } catch (error) {
            logger.error(`Error fetching weather for ${city}:`, error.message);
            throw new Error('Unable to fetch weather data');
        }
    }

    /*
    
        Forecast API Response Structure (Example: OpenWeatherMap for 5-day forecast)

        city:       // City information
            - id:      City ID
            - name:    City name
            - coord:   Geographic coordinates (lon, lat)
            - country: Country code

        list:       // Array of forecast data (every 3 hours)
            - dt:      Time of forecast (UNIX timestamp)
            - main:    Main weather data
                - temp:        Temperature in Kelvin
                - feels_like:  Feels like temperature
                - temp_min:    Minimum temperature
                - temp_max:    Maximum temperature
                - pressure:    Atmospheric pressure
                - humidity:    Humidity percentage
            - weather: Array of weather conditions (usually one object)
                - id:      Weather condition ID
                - main:    Short description (e.g., "Clear")
                - description: Detailed description (e.g., "clear sky")
                - icon:    Icon code for weather icon
            - wind:    Wind data
                - speed:   Wind speed in m/s
                - deg:     Wind direction in degrees
            - clouds: Cloudiness percentage
            - dt_txt:  Date and time of the forecast (formatted string)

        - sys:     System data (sunrise, sunset, etc.)
        - timezone: Shift in seconds from UTC
        - cod:     Response code (200 means OK)
    */

    async getForecast(city, days = 5) {
        try {
            // Get cached data
            const cached = cacheService.get(`forecast:${city}:${days}`);
            if (cached) {
                // logger.info(`Cached hit for ${city}:${days}`);
                return cached;
            } 
            
            // Request data
            const response = await axios.get(`${this.baseUrl}/forecast`, {
                params: {
                    q: city,
                    appid: this.apiKey,
                    units: 'metric',
                    cnt: days * 8 // 8 forecasts per day (every 3 hours)
                }
            });

            if (response.status !== 200) {
                throw new Error(`Failed to fetch weather data: ${response.statusText}`);
            }

            const forecast = response.data.list.map(item => new Weather({
                city: city,
                temperature: item.main.temp,
                description: item.Weather[0].description,
                humidity: item.main.humidity,
                windSpeed: item.wind.speed
            }));

            cacheService.set(`forecast:${city}:${days}`, forecast, 1800); // 30 min cache
            // logger.info(`Weather forecast fetched for ${city} within ${days} days`);
            return forecast;
        } catch (error) {
            logger.error(`Error fetching forecast for ${city}:`, error.message);
            throw new Error(`Unable to fetch forecast data`);
        }
    }
}

module.exports = new WeatherService();