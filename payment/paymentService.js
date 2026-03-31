const Razorpay = require("razorpay");
const crypto = require("crypto");
const queries = require("./paymentQueries");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Step 1: Create Razorpay order
async function createOrder(userId, bookingId, amount) {
    const booking = await queries.getBooking(bookingId);
    if (!booking) throw new Error("Booking not found");
    if (booking.status !== "PENDING") throw new Error("Booking already processed");

    // Create order in Razorpay (amount in paise)
    const order = await razorpay.orders.create({
        amount: amount * 100, // convert ₹ to paise
        currency: "INR",
        receipt: bookingId,
        notes: { bookingId, userId }
    });

    // Save order in DB with INITIATED status
    const payment = await queries.createPayment(
        bookingId,
        amount,
        order.id // use razorpay order_id as idempotency key
    );

    return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        paymentId: payment.id,
        keyId: process.env.RAZORPAY_KEY_ID
    };
}

// Step 2: Verify payment signature and confirm booking
async function verifyPayment(userId, bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature) {

    // Verify signature — prevents tampered payments
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

    if (expectedSignature !== razorpaySignature) {
        throw new Error("Invalid payment signature");
    }

    // Signature valid — confirm booking
    await queries.updatePaymentStatusByOrderId(razorpayOrderId, "SUCCESS", razorpayPaymentId);
    await queries.confirmBooking(bookingId);
    await queries.bookSeats(bookingId);

    return { success: true, paymentId: razorpayPaymentId };
}

module.exports = { createOrder, verifyPayment };