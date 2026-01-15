const express = require("express");
const axios = require("axios");
const db = require("../common/db");
const userAuth = require("../middlewares/userAuth");

const bookingRouter = express.Router();

bookingRouter.post("/book", userAuth, async (req, res) => {
    try {
        const { eventId, seatId } = req.body;
        const userId = req.user.id;

        if (!eventId || !seatId) {
            return res.status(400).json({ error: "eventId and seatId required" });
        }

        const lockSeatURL = process.env.LOCK_SEAT_URL;

        const cookieHeader = req.headers.cookie;

        const lock = await axios.post(
            lockSeatURL,
            { eventId, seatId },
            {
                headers: {
                    Cookie: cookieHeader
                }
            }
        );


        if (!lock.data.success) {
            return res.status(409).json({ error: "Seat already locked" });
        }

        const result = await db.query(
            `INSERT INTO bookings(user_id, event_id, seat_id, status)
       VALUES ($1, $2, $3, 'PENDING')
       RETURNING id`,
            [userId, eventId, seatId]
        );

        res.json({ bookingId: result.rows[0].id });
    } catch (err) {
        res.status(500).send("ERROR : " + err.message);
    }
});

bookingRouter.post("/confirm", userAuth, async (req, res) => {
    try {
        const { bookingId } = req.body;
        const userId = req.user.id;

        if (!bookingId) {
            return res.status(400).json({ error: "bookingId required" });
        }

        const result = await db.query(
            `UPDATE bookings
       SET status = 'CONFIRMED'
       WHERE id = $1 AND user_id = $2 AND status = 'PENDING'
       RETURNING id`,
            [bookingId, userId]
        );

        if (result.rowCount === 0) {
            return res.status(400).json({
                error: "Booking not found, already confirmed, or unauthorized"
            });
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

bookingRouter.post("/cancel", userAuth, async (req, res) => {
    try {
        const { bookingId } = req.body;
        const userId = req.user.id;

        if (!bookingId) {
            return res.status(400).json({ error: "bookingId required" });
        }

        const bookingResult = await db.query(
            `SELECT event_id, seat_id, status FROM bookings WHERE id = $1 AND user_id = $2`, [bookingId, userId]
        );

        if (bookingResult.rows.length === 0) {
            return res.status(404).json({ error: "Booking not found" });
        }

        const booking = bookingResult.rows[0];

        if (booking.status !== "PENDING") {
            throw new Error("Only pending tickets can be cancelled");
        }

        const unlockSeatURL = process.env.UNLOCK_SEAT_URL;

        await axios.post(
            unlockSeatURL,
            {
                eventId: booking.event_id,
                seatId: booking.seat_id
            },
            {
                headers: {
                    Cookie: req.headers.cookie
                }
            }
        );

        await db.query(
            `UPDATE bookings
       SET status = 'CANCELLED'
       WHERE id = $1`,
            [bookingId]
        );

        res.json({ success: true });
    } catch (err) {
        res.status(500).send("ERROR : " + err.message);
    }
});

module.exports = bookingRouter;
