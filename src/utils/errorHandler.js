const logger = require('./logger');

const errorHandler = (err, req, res, next) => {
    logger.error(`Error occured: ${err.message}`);

    if (err.response && err.response.status === 404) {
        return res.status(404).json({
            success: false,
            message: 'City not found'
        });
    }

    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
}

module.exports = errorHandler;