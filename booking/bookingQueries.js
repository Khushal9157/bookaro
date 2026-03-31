const db = require("../common/db");

async function createBooking(userId, eventId) {

    const result = await db.query(
        `INSERT INTO bookings(user_id,event_id,status)
     VALUES($1,$2,'PENDING')
     RETURNING *`,
        [userId, eventId]
    );

    return result.rows[0];
}

async function addBookingSeats(bookingId, seats) {

    const values = [];
    const params = [];

    seats.forEach((seat, index) => {

        const base = index * 3;

        values.push(`($${base + 1},$${base + 2},$${base + 3})`);

        params.push(bookingId, seat.id, seat.price);

    });

    const query = `
  INSERT INTO booking_seats(booking_id,seat_id,price)
  VALUES ${values.join(",")}
  `;

    await db.query(query, params);
}

async function getSeats(seatIds) {

    const result = await db.query(
        `SELECT id,price,event_id
     FROM seats
     WHERE id = ANY($1)`,
        [seatIds]
    );

    return result.rows;
}

async function getUserBookings(userId) {

    const result = await db.query(
        `SELECT b.id, b.event_id, b.status, array_agg(s.seat_number) AS seats
     FROM bookings b
     JOIN booking_seats bs ON b.id = bs.booking_id
        JOIN seats s ON bs.seat_id = s.id   
        WHERE b.user_id = $1
        GROUP BY b.id`,
        [userId]
    );
    return result.rows;
}

module.exports = {
    createBooking,
    addBookingSeats,
    getSeats,
    getUserBookings
};