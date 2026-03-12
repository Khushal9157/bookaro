const db = require("../common/db");

async function createEvent({ title, description, venue, eventDate }) {
    const result = await db.query(
        `INSERT INTO events(title, description, venue, event_date)
     VALUES ($1,$2,$3,$4)
     RETURNING *`,
        [title, description, venue, eventDate]
    );

    return result.rows[0];
}

async function insertSeats(eventId, seats) {
    const values = [];
    const params = [];

    seats.forEach((seat, index) => {
        const base = index * 3;

        values.push(`($${base + 1},$${base + 2},$${base + 3})`);

        params.push(eventId, seat.number, seat.price);
    });

    const query = `
    INSERT INTO seats(event_id, seat_number, price)
    VALUES ${values.join(",")}
  `;

    await db.query(query, params);
}

async function getEvents(limit, offset) {
    const result = await db.query(
        `SELECT *
     FROM events
     ORDER BY event_date
     LIMIT $1 OFFSET $2`,
        [limit, offset]
    );

    return result.rows;
}

async function getSeats(eventId, status, limit, offset) {
    const result = await db.query(
        `SELECT id, seat_number, price, status
     FROM seats
     WHERE event_id = $1
     AND ($2::text IS NULL OR status = $2)
     ORDER BY seat_number
     LIMIT $3 OFFSET $4`,
        [eventId, status, limit, offset]
    );

    return result.rows;
}

module.exports = {
    createEvent,
    insertSeats,
    getEvents,
    getSeats
};