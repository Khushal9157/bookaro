require("dotenv").config({ path: require("path").join(__dirname, ".env") });
console.log("SECRET:", process.env.INTERNAL_SERVICE_SECRET); // should print the value now
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const rateLimiter = require("./rateLimiter");
const setupRoutes = require("./proxyRoutes");

const app = express();
// ── 1. CORS ────────────────────────────────────────────────────
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// ── 2. Proxy routes FIRST — before body parsers ────────────────
setupRoutes(app);

// ── 3. Body parsers — only affect non-proxied routes below ─────
app.use(express.json());
app.use(cookieParser());

// ── 4. Rate limiter + logger — gateway-native routes only ──────
app.use(rateLimiter);

app.use((req, res, next) => {
    console.log("Incoming request:", req.method, req.url);
    next();
});

// ── 5. Gateway-native routes (health check etc.) ───────────────
app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});