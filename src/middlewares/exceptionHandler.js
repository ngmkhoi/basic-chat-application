const { HTTP_STATUS, ERROR_MESSAGES, RESPONSE_MESSAGES } = require('../config/constants');

const exceptionHandler = (err, req, res, _) => {
    const statusCode = err.statusCode || err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;

    if (typeof res.error === 'function') {
        res.error(statusCode, err.message || ERROR_MESSAGES.INTERNAL_ERROR);
    } else {
        res.status(statusCode).json({
            status: RESPONSE_MESSAGES.ERROR,
            message: err.message || ERROR_MESSAGES.INTERNAL_ERROR
        });
    }
}

module.exports = exceptionHandler;