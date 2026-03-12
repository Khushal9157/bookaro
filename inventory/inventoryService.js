const queries = require("../inventoryQueries");

function generateSeats(rows, seatsPerRow, price) {
    const seats = [];

    for (let r = 0; r < rows; r++) {
        const rowLetter = String.fromCharCode(65 + r);

        for (let s = 1; s <= seatsPerRow; s++) {
            seats.push({
                number: `${rowLetter}${s}`,
                price
            });
        }
    }

    return seats;
}

async function createEvent(data) {
    const {
        title,
        description,
        venue,
        eventDate,
        rows = 10,
        seatsPerRow = 20,
        price = 500
    } = data;

    const event = await queries.createEvent({
        title,
        description,
        venue,
        eventDate
    });

    const seats = generateSeats(rows, seatsPerRow, price);

    await queries.insertSeats(event.id, seats);

    return event;
}

async function getEvents(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    return queries.getEvents(limit, offset);
}

async function getSeats(eventId, status, page = 1, limit = 50) {
    const offset = (page - 1) * limit;

    return queries.getSeats(eventId, status, limit, offset);
}

module.exports = {
    createEvent,
    getEvents,
    getSeats
};