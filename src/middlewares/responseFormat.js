const { HTTP_STATUS, RESPONSE_MESSAGES } = require('../config/constants');

const responseFormat = ( req, res, next ) => {
    res.success = (data, code = HTTP_STATUS.OK, passProps = {}) => {
        res.status(code).json({
            status: RESPONSE_MESSAGES.SUCCESS,
            data: data,
            ...passProps
        });
    };

    res.error = (code, message) => {
        res.status(code).json({
            status: RESPONSE_MESSAGES.ERROR,
            message: message,
        });
    };

    next();
}

module.exports = responseFormat;