const paymentService = require("./paymentService");

// Step 1: Create order → returns orderId to frontend
async function createOrder(req, res) {
    try {
        const userId = req.user.id;
        const { bookingId, amount } = req.body;

        const order = await paymentService.createOrder(userId, bookingId, amount);
        res.status(201).json(order);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}

// Step 2: Verify payment → confirms booking
async function verifyPayment(req, res) {
    try {
        const userId = req.user.id;
        const {
            bookingId,
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        } = req.body;

        const result = await paymentService.verifyPayment(
            userId,
            bookingId,
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        );

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}

module.exports = { createOrder, verifyPayment };