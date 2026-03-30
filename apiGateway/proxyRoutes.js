require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const { createProxyMiddleware } = require("http-proxy-middleware");

const logger = {
    info: (...args) => console.log("[PROXY INFO] ", ...args),
    warn: (...args) => console.warn("[PROXY WARN] ", ...args),
    error: (...args) => console.error("[PROXY ERROR]", ...args),
};

function makeProxy(target, serviceName, pathPrefix) {
    return createProxyMiddleware({
        target,
        changeOrigin: true,
        logger,
        pathRewrite: (path) => {
            const newPath = `/${pathPrefix}${path}`;
            console.log(`[REWRITE] ${path} → ${newPath}`);
            return newPath;
        },
        on: {
            proxyReq: (proxyReq, req) => {
                const secret = process.env.INTERNAL_SERVICE_SECRET;
                proxyReq.setHeader("x-internal-token", secret);
                console.log(`[→ ${serviceName}] ${req.method} ${req.url} | token: ${secret}`);
            },
            proxyRes: (proxyRes, req) => {
                console.log(`[← ${serviceName}] ${proxyRes.statusCode} ${req.url}`);
            },
            error: (err, req, res) => {
                console.error(`[✗ ${serviceName}] ${err.message}`);
                res.status(502).json({
                    error: `${serviceName} unreachable`,
                    detail: err.message,
                });
            },
        },
    });
}

function setupRoutes(app) {
    app.use("/auth", makeProxy("http://127.0.0.1:3001", "Auth", "auth"));
    app.use("/inventory", makeProxy("http://127.0.0.1:3002", "Inventory", "inventory"));
    app.use("/booking", makeProxy("http://127.0.0.1:3003", "Booking", "booking"));
    app.use("/payments", makeProxy("http://127.0.0.1:3005", "Payment", "payments"));
}

module.exports = setupRoutes;