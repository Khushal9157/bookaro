const inventoryService = require("../inventoryService");

async function createEvent(req, res) {
    try {
        const event = await inventoryService.createEvent(req.body);

        res.status(201).json({
            message: "Event created",
            event
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Failed to create event"
        });
    }
}

async function getEvents(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;

        const events = await inventoryService.getEvents(page);

        res.json(events);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Failed to fetch events"
        });
    }
}

async function getSeats(req, res) {
    try {
        const { eventId } = req.params;

        const status = req.query.status || null;

        const page = parseInt(req.query.page) || 1;

        const seats = await inventoryService.getSeats(eventId, status, page);

        res.json(seats);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Failed to fetch seats"
        });
    }
}

module.exports = {
    createEvent,
    getEvents,
    getSeats
};