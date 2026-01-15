const jwt = require('jsonwebtoken');
const {SecretAccess} = require("../config/jwt");
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.replace('Bearer', '')?.trim();

    if (!token) {
        return res.error(401, "Token not found, please log in.")
    }

    try {
        req.user = jwt.verify(token, SecretAccess);
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.error(401, 'Access token expired');
        }
        return res.error(403, 'Invalid access token');
    }
}

module.exports = authMiddleware;