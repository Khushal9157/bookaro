const express = require("express");
const cookieParser = require("cookie-parser");

const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", bookingRoutes);

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {

    console.log(`Booking service running on ${PORT}`);

});