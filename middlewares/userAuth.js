const jwt = require("jsonwebtoken");
const db = require("../common/db");

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Invalid user");
        }

        const decoded = jwt.verify(token, process.env.jwtSecret);

        const user = await db.query("SELECT 1 FROM users WHERE email = $1", [decoded.email]);
        if (user.rows.length === 0) {
            throw new Error("User not found");
        }
        user = user.rows[0];
        req.user = user;
        next();
    } catch (err) {
        res.status(401).send("ERROR : " + err.message);
    }
}

module.exports = userAuth;