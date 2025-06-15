const weatherService = require("../services/weatherService");
const logger = require('../utils/logger');

class WeatherController {
    async getCurrentWeather(req, res, next) {
        try {
            const { city, units } = req.params;

            if (!city) {
                return res.status(400).json({
                    success: false,
                    message: `City parameter is required`
                });
            }

            if (units === 'undefined' || units == null) { units = 'metric' }

            const weather = await weatherService.getCurrentWeather(city, units);

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