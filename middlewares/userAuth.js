const jwt = require("jsonwebtoken");
const db = require("../common/db");

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Invalid user");
        }
        const JWT_SECRET = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await db.query("SELECT id, email FROM users WHERE email = $1", [decoded.email]);
        if (user.rows.length === 0) {
            throw new Error("User not found");
        }
        req.user = user.rows[0];
        next();
    } catch (err) {
        res.status(401).send("ERROR : " + err.message);
    }
}

module.exports = userAuth;