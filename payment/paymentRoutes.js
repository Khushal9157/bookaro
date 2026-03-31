const express = require("express");
const router = express.Router();
const paymentController = require("./paymentController");
const internalAuth = require("../middlewares/internalAuth");
const userAuth = require("../middlewares/userAuth");

// POST /payments/create-order → creates Razorpay order
router.post("/create-order", internalAuth, userAuth, paymentController.createOrder);

// POST /payments/verify → verifies signature + confirms booking
router.post("/verify", internalAuth, userAuth, paymentController.verifyPayment);

module.exports = router;