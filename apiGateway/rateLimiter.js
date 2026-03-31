const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: {
        error: "Too many requests"
    }
});

module.exports = limiter;