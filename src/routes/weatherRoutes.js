const express = require('express');
const weatherController = require('../controllers/weatherController');

const router = express.Router();

router.get('/weather', weatherController.getCurrentWeather);
router.get('/forecast/:city/:units/:cmt', weatherController.getForecast);

module.exports = router;