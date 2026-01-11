const jwt = require('jsonwebtoken');
const {secret} = require("../config/jwt");
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.error(401, "Token not found, please log in.")
    }

    try {
        req.user = jwt.verify(token, secret);
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token is invalid or expired." });
    }
}

module.exports = authMiddleware;