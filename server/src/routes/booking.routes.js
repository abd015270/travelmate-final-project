const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const {
  createBooking,
  getBookings,
  deleteBooking,
} = require("../controllers/booking.controller");

router.post("/:tripId", protect, createBooking);

router.get("/", protect, getBookings);

router.delete("/:id", protect, deleteBooking);

module.exports = router;