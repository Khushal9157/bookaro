const express = require("express");

const bookingRouter = express.Router();

const bookingController = require("./bookingController");

const internalAuth = require("../middlewares/internalAuth");
const userAuth = require("../middlewares/userAuth");

bookingRouter.post("/bookings", internalAuth, userAuth, bookingController.createBooking);

module.exports = bookingRouter;