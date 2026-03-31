const express = require("express");

const bookingRouter = express.Router();

const controller = require("./bookingController");

const internalAuth = require("../middlewares/internalAuth");
const userAuth = require("../middlewares/userAuth");

bookingRouter.post("/createbooking", internalAuth, userAuth, controller.createBooking);
bookingRouter.get("/userbookings", internalAuth, userAuth, controller.getUserBookings);

module.exports = bookingRouter;