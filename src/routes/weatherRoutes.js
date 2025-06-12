const express = require('express');
const weatherController = require('../controllers/weatherController');

const router = express.Router();

router.get('/weather/:city', weatherController.getCurrentWeather);
router.get('/forecast/:city', weatherController.getForecast);

module.exports = router;