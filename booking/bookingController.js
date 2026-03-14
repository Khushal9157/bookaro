const bookingService = require("../services/bookingService");

async function createBooking(req, res) {

    try {

        const userId = req.user.id;

        const { seatIds } = req.body;

        const booking = await bookingService.createBooking(userId, seatIds);

        res.status(201).json(booking);

    } catch (err) {

        console.error(err);

        res.status(400).json({
            error: err.message
        });

    }

}

module.exports = {
    createBooking
};