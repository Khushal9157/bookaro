const express = require("express");
const cookieParser = require("cookie-parser");

const paymentRoutes = require("./paymentRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", paymentRoutes);

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
    console.log(`Payment service running on port ${PORT}`);
});