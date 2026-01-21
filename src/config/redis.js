const {createClient} = require("redis");

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT || 6379
    },
    password: process.env.REDIS_PASSWORD
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

(async () => {
    await redisClient.connect();
})();

module.exports = redisClient;