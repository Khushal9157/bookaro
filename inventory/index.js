const express = require("express");
const { lockSeat } = require("./seatLock");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/lock", async (req, res) => {
    const { eventId, seatId, userId } = req.body;
    const success = await lockSeat(eventId, seatId, userId);
    res.json({ success });
});

app.listen(process.env.inventoryServicePORT);
