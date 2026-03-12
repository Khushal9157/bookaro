const express = require("express");

const InventoryRouter = express.Router();

const controller = require("../inventoryController");
const internalAuth = require("../../middlewares/internalAuth");

InventoryRouter.get("/events", internalAuth, controller.getEvents);
InventoryRouter.get("/events/:eventId/seats", internalAuth, controller.getSeats);
InventoryRouter.post("/events", internalAuth, controller.createEvent);

module.exports = InventoryRouter;