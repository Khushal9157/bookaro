const { createProxyMiddleware } = require("http-proxy-middleware");

function setupRoutes(app) {

    const options = {
        changeOrigin: true,
        onProxyReq: (proxyReq) => {
            proxyReq.setHeader(
                "x-internal-token",
                process.env.INTERNAL_SERVICE_SECRET
            );
        }
    };

    app.use(
        "/auth",
        createProxyMiddleware({
            target: "http://auth:4000",
            ...options
        })
    );

    app.use(
        "/events",
        createProxyMiddleware({
            target: "http://inventory:4001",
            ...options
        })
    );

    app.use(
        "/bookings",
        createProxyMiddleware({
            target: "http://booking:4002",
            ...options
        })
    );

    app.use(
        "/payments",
        createProxyMiddleware({
            target: "http://payment:4003",
            ...options
        })
    );

}

module.exports = setupRoutes;