const queries = require("../paymentQueries");

function simulatePaymentProvider() {

    const rand = Math.random();

    if (rand < 0.9) {
        return "SUCCESS";
    }

    return "FAILED";
}

async function createPayment(userId, bookingId, amount, idempotencyKey) {

    const existingPayment =
        await queries.getPaymentByKey(idempotencyKey);

    if (existingPayment) {
        return existingPayment;
    }

    const booking =
        await queries.getBooking(bookingId);

    if (!booking) {
        throw new Error("Booking not found");
    }

    if (booking.status !== "PENDING") {
        throw new Error("Booking already processed");
    }

    const payment =
        await queries.createPayment(
            bookingId,
            amount,
            idempotencyKey
        );

    const result = simulatePaymentProvider();

    if (result === "SUCCESS") {

        await queries.updatePaymentStatus(payment.id, "SUCCESS");

        await queries.confirmBooking(bookingId);

        await queries.bookSeats(bookingId);

    } else {

        await queries.updatePaymentStatus(payment.id, "FAILED");

        await queries.failBooking(bookingId);

    }

    return payment;
}

module.exports = {
    createPayment
};