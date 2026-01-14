const express = require("express");
const routes = require("./bookingRoutes");

const app = express();
app.use(express.json());
app.use(routes);

app.listen(process.env.bookingServicePORT);
