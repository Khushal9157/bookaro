const express = require("express");
const db = require("../common/db");

const router = express.Router();

router.post("/pay", async (req, res) => {
    const { bookingId, amount, idempotencyKey } = req.body;

    try {
        await db.query(
            "INSERT INTO payments(booking_id,amount,idempotency_key,status) VALUES($1,$2,$3,$4)",
            [bookingId, amount, idempotencyKey, "SUCCESS"]
        );

        await db.query(
            "UPDATE bookings SET status='CONFIRMED' WHERE id=$1",
            [bookingId]
        );

        res.send("Payment successful");
    } catch {
        res.send("Duplicate payment ignored");
    }
});

module.exports = router;
