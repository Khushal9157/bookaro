const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../common/db");
const validator = require('validator');

const authRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

authRouter.post("/register", async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!validator.isEmail(email)) {
            throw new Error("Invalid email");
        }
        if (!validator.isStrongPassword(password)) {
            throw new Error("Weak password .Enter a strong password");
        }

        const user = await db.query("SELECT 1 FROM users WHERE email = $1", [email]);
        if (user.rows.length > 0) {
            throw new Error(`${email} is already registered`);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2)",
            [email, hashedPassword]
        );

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const userInDB = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userInDB.rows.length === 0) {
        throw new Error("Invalid Credentials");
    }

    const user = userInDB.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET,
        { expiresIn: "10h" }
    );

    res.cookie("token", token, {
        expires: new Date(Date.now() + 10 * 3600000)
    });

    res.send("User loggedin Successfully");
});

authRouter.post("/logout", (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    });
    res.send("Logged out successfully");
});

module.exports = authRouter;
