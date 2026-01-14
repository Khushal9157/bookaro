const express = require("express");
const axios = require("axios");
const db = require("../common/db");

const bookingRouter = express.Router();

bookingRouter.post("/book", async (req, res) => {
    const { userId, eventId, seatId } = req.body;

    const lock = await axios.post(lockSeatURL, {
        userId, eventId, seatId
    });

    if (!lock.data.success) {
        return res.status(409).send("Seat already booked");
    }

    const result = await db.query(
        "INSERT INTO bookings(user_id,event_id,seat_id,status) VALUES($1,$2,$3,$4) RETURNING id",
        [userId, eventId, seatId, "PENDING"]
    );

    res.json({ bookingId: result.rows[0].id });
});

module.exports = bookingRouter;
