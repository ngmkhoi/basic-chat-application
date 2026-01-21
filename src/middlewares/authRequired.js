const jwt = require('jsonwebtoken');
const {SecretAccess} = require("../config/jwt");
const { HTTP_STATUS, ERROR_MESSAGES } = require('../config/constants');
const {isBlacklisted} = require("../helpers/tokenBlacklist");
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.replace('Bearer', '')?.trim();

    if (!token) {
        return res.error(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.TOKEN_NOT_FOUND)
    }

    if (await isBlacklisted(token)) {
        return res.error(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.TOKEN_REVOKED);
    }

    try {
        req.user = jwt.verify(token, SecretAccess);
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.error(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED);
        }
        return res.error(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.INVALID_ACCESS_TOKEN);
    }
}

module.exports = authMiddleware;