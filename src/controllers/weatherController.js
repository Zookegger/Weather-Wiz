const weatherService = require("../services/weatherService");
const logger = require('../utils/logger');

class WeatherController {
    async getCurrentWeather(req, res, next) {
        try {
            let { city, lat, lon, units = 'metric' } = req.query;

            if (!city && (!lat || !lon)) {
                return res.status(400).json({
                    success: false,
                    message: `City name or coordinates (latitude and longitude) are required`
                });
            }

            if (lat && lon) {
                lat = parseFloat(lat);
                lon = parseFloat(lon);
                if (isNaN(lat) || isNaN(lon)) {
                    return res.status(400).json({
                        success: false,
                        message: "Latitude and longitude must be valid numbers"
                    });
                }
            }

            const weather = city 
                ? await weatherService.getCurrentWeatherByCity(city.trim(), units) 
                : await weatherService.getCurrentWeatherByCoordinates(lat, lon, units);

            res.json({
                success: true,
                data: weather
            });
        } catch (error) {
            next(error);
        }
    }

    async getForecast(req, res, next) {
        try {
            const { city } = req.params;
            const { days } = req.query;

            const forecast = await weatherService.getForecast(city, parseInt(days) || 5);

            res.json({
                success: true,
                data: forecast
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new WeatherController();