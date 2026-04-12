const express = require("express");
const router = express.Router();
const paymentController = require("./paymentController");
const internalAuth = require("../middlewares/internalAuth");
const userAuth = require("../middlewares/userAuth");

router.post("/create-order", internalAuth, userAuth, paymentController.createOrder);

router.post("/verify", internalAuth, userAuth, paymentController.verifyPayment);

module.exports = router;