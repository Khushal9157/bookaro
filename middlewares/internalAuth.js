function internalAuth(req, res, next) {

    const token = req.headers["x-internal-token"];

    console.log(process.env.INTERNAL_SERVICE_SECRET)
    if (!token) {
        return res.status(403).json({
            error: "Gateway token missing"
        });
    }
    if (token !== process.env.INTERNAL_SERVICE_SECRET) {
        console.log("gaand mar gayi")
        return res.status(403).json({
            error: "Invalid gateway token"
        });
    }

    next();
}

module.exports = internalAuth;