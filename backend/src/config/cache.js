const Redis = require("ioredis");

const serviceUri = process.env.REDIS_URI;

const redis = new Redis(serviceUri);

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.error("Redis error", err);
});

module.exports = redis;