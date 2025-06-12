const axios = require('axios');
const Weather = require('../models/Weather');
const cacheService = require('./cacheService');
const logger = require('../utils/logger');

class WeatherService {
    constructor () {
        this.apiKey = process.env.OPENWEATHER_API_KEY;
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    }

    async getCurrentWeather(city) {
        try {
            // Check cache first
            const cached = cacheService.get(`weather:${city}`);
            if (cached) {
                logger.info(`Cached hit for ${city}`);
                return cached;
            }
            
            // Fetch from API
            const response = await axios.get(`${this.baseUrl}/weather`, {
                params: {
                    q: city,
                    appid: this.apiKey,
                    units: 'metric'
                }
            });

            if (response.status !== 200) {
                throw new Error(`Failed to fetch weather data: ${response.statusText}`);
            }

            const weatherData = new Weather({
                city: response.data.name,
                temperature: response.data.main.temp,
                description: response.data.weather[0].description,
                humidity: response.data.main.humidity,
                windSpeed: response.data.wind.speed
            });
            
            // Cache for 10 minutes
            cacheService.set(`weather:${city}`, weatherData, 600);
            logger.info(`Weather data fetched for ${city}`);
            return weatherData;
        } catch (error) {
            logger.error(`Error fetching weather for ${city}:`, error.message);
            throw new Error('Unable to fetch weather data');
        }
    }

    async getForecast(city, days = 5) {
        try {
            // Get cached data
            const cached = cacheService.get(`forecast:${city}:${days}`);
            if (cached) {
                logger.info(`Cached hit for ${city}:${days}`);
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
            logger.info(`Weather forecast fetched for ${city} within ${days} days`);
            return forecast;
        } catch (error) {
            logger.error(`Error fetching forecast for ${city}:`, error.message);
            throw new Error(`Unable to fetch forecast data`);
        }
    }
}

module.exports = new WeatherService();