const Redis = require("ioredis");

const serviceUri = process.env.REDIS_URI;

const redis = new Redis(serviceUri);

// Separate client for blocking stream operations
const redisStream = new Redis(serviceUri);

redis.on("connect", () => {console.log("Redis connected");});
redis.on("error", (err) => {console.error("Redis error", err);});

redisStream.on("connect", () => console.log("Redis Stream connected"));
redisStream.on("error", (err) => console.error("Redis Stream error", err));

module.exports = {redis, redisStream};