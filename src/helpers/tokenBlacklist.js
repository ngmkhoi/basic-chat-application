const redisClient = require('../config/redis');
const jwt = require('jsonwebtoken');

const BLACKLIST_PREFIX = 'blacklist:';

const addToBlacklist = async (token) => {
    try {
        const decoded = jwt.decode(token);
        const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

        if (expiresIn > 0) {
            await redisClient.setEx(
                `${BLACKLIST_PREFIX}${token}`,
                expiresIn,
                'revoked'
            );
        }
    } catch (error) {
        console.error('Error adding token to blacklist:', error);
        throw error;
    }
};

const isBlacklisted = async (token) => {
    try {
        const result = await redisClient.get(`${BLACKLIST_PREFIX}${token}`);
        return result !== null;
    } catch (error) {
        console.error('Error checking blacklist:', error);
        return false;
    }
};

module.exports = {
    addToBlacklist,
    isBlacklisted
};
