const paymentService = require("../paymentService");

async function createPayment(req, res) {
    try {

        const userId = req.user.id;

        const { bookingId, amount, idempotencyKey } = req.body;

        const payment = await paymentService.createPayment(
            userId,
            bookingId,
            amount,
            idempotencyKey
        );

        res.status(201).json(payment);

    } catch (err) {

        console.error(err);

        res.status(400).json({
            error: err.message
        });

    }
}

module.exports = {
    createPayment
};