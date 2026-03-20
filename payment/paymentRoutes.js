const express = require("express");

const router = express.Router();

const paymentController = require("./paymentController");

const internalAuth = require("../middlewares/internalAuth");
const userAuth = require("../middlewares/userAuth");

router.post("/payments", internalAuth, userAuth, paymentController.createPayment);

module.exports = router;