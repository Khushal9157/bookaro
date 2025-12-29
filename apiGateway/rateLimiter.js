const redis = require("ioredis");

const rateLimiter = async (req, res, next) => {
    const key = `rate:${req.ip}`;
    const count = await redis.incr(key);
    if (count === 1) {
        await redis.expire(key, 1);
    }
    if (count > 5) {
        return res.status(429).send("Too many requests");
    }
    next();
};

module.exports = rateLimiter;
