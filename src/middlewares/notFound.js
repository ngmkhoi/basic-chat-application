const { HTTP_STATUS } = require('../config/constants');

const notFound = (req, res, _) => {
    res.error(HTTP_STATUS.NOT_FOUND, `Can not ${req.method} ${req.url}`);
}

module.exports = notFound;