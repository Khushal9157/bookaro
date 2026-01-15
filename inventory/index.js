require("dotenv").config({ path: "inventory/.env" });

const express = require("express");
const cookieParser = require("cookie-parser");
const { lockSeat, unlockSeat } = require("./seatLock");
const userAuth = require("../middlewares/userAuth");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/lock", userAuth, async (req, res) => {
    try {
        const { eventId, seatId } = req.body;
        const userId = req.user.id;
        const success = await lockSeat(eventId, seatId, userId);
        res.json({ success });
    } catch (err) {
        res.status(401).send("ERROR :" + err.message);
    }

});

app.post("/unlock", userAuth, async (req, res) => {
    try {
        const { eventId, seatId } = req.body;
        const userId = req.user.id;

        if (!eventId || !seatId) {
            return res.status(400).json({ error: "eventId and seatId required" });
        }

        await unlockSeat(eventId, seatId, userId);
        res.json({ success: true });
    } catch (err) {
        res.status(403).json({ error: err.message });
    }
});


const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Inventory Service is UP on port ${PORT}`);
});
