require("dotenv").config({ path: "auth/.env" });

const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./authRoutes")

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3001;

app.use("/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
});
