const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const {
  createBooking,
  getBookings,
} = require("../controllers/booking.controller");

router.post("/:tripId", protect, createBooking);

router.get("/", protect, getBookings);

module.exports = router;