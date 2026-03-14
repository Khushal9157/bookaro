const express = require("express");
const cookieParser = require("cookie-parser");

const rateLimiter = require("./rateLimiter");
const setupRoutes = require("./proxyRoutes");

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(rateLimiter);

setupRoutes(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});