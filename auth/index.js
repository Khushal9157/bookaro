const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../common/db");

const app = express();
app.use(express.json());

app.post("/login", async (req, res) => {
    const { email } = req.body;
    const token = jwt.sign({ email }, "SECRET");
    res.json({ token });
});

app.listen(3001);
