const redis = require("../redisClient");
const queries = require("../bookingQueries");

const LOCK_TTL = 300;

async function lockSeat(seatId, bookingId) {

    const key = `seat_lock:${seatId}`;

    const result = await redis.set(
        key,
        bookingId,
        "NX",
        "EX",
        LOCK_TTL
    );

    return result === "OK";
}

async function createBooking(userId, seatIds) {

    const seats = await queries.getSeats(seatIds);

    if (seats.length !== seatIds.length) {
        throw new Error("Invalid seats");
    }

    const eventId = seats[0].event_id;

    const booking = await queries.createBooking(userId, eventId);

    for (const seat of seats) {

        const locked = await lockSeat(seat.id, booking.id);

        if (!locked) {
            throw new Error("Seat already locked");
        }

    }

    await queries.addBookingSeats(booking.id, seats);

    return booking;
}

module.exports = {
    createBooking
};