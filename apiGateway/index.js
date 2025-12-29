const express = require("express");
const rateLimiter = require("./rateLimiter");
const app = express();
app.use(rateLimiter)
app.use(express.json());

app.listen(process.env.PORT);