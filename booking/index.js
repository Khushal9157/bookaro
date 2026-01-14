const express = require("express");
const bookingRoutes = require("./bookingRoutes");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bookingRoutes);

app.listen(process.env.bookingServicePORT);
