require("dotenv").config({ path: "booking/.env" });
const express = require("express");
const cookieParser = require("cookie-parser");

const bookingRoutes = require("./bookingRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/booking", bookingRoutes);

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {

    console.log(`Booking service running on ${PORT}`);

});