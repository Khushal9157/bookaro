const express = require("express");
const authRoutes = require("./authRoutes");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);

app.listen(process.env.authServicePORT, () => {
    console.log(`Auth Service running on port ${process.env.authServicePORT}`);
});
