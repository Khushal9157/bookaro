const db = require("../common/db");

async function getPaymentByKey(key) {

    const result = await db.query(
        `SELECT * FROM payments
     WHERE idempotency_key = $1`,
        [key]
    );

    return result.rows[0];
}

async function getBooking(bookingId) {

    const result = await db.query(
        `SELECT *
     FROM bookings
     WHERE id = $1`,
        [bookingId]
    );

    return result.rows[0];
}

async function createPayment(bookingId, amount, key) {

    const result = await db.query(
        `INSERT INTO payments
     (booking_id, amount, status, provider, idempotency_key)
     VALUES ($1,$2,'INITIATED','mock_gateway',$3)
     RETURNING *`,
        [bookingId, amount, key]
    );

    return result.rows[0];
}

async function updatePaymentStatus(paymentId, status) {

    await db.query(
        `UPDATE payments
     SET status = $1
     WHERE id = $2`,
        [status, paymentId]
    );
}

async function confirmBooking(bookingId) {

    await db.query(
        `UPDATE bookings
     SET status = 'CONFIRMED'
     WHERE id = $1`,
        [bookingId]
    );
}

async function failBooking(bookingId) {

    await db.query(
        `UPDATE bookings
     SET status = 'FAILED'
     WHERE id = $1`,
        [bookingId]
    );
}

async function bookSeats(bookingId) {

    await db.query(
        `UPDATE seats
     SET status = 'BOOKED'
     WHERE id IN (
       SELECT seat_id
       FROM booking_seats
       WHERE booking_id = $1
     )`,
        [bookingId]
    );
}

module.exports = {
    getPaymentByKey,
    getBooking,
    createPayment,
    updatePaymentStatus,
    confirmBooking,
    failBooking,
    bookSeats
};