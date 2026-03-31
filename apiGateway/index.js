require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const rateLimiter = require("./rateLimiter");
const setupRoutes = require("./proxyRoutes");

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_SERVICE_URL,
    credentials: true
}));

setupRoutes(app);

app.use(express.json());
app.use(cookieParser());

app.use(rateLimiter);

app.use((req, res, next) => {
    console.log("Incoming request:", req.method, req.url);
    next();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});