const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} = require("../controllers/trip.controller");

router.post("/", protect, createTrip);

router.get("/", getTrips);

router.get("/:id", getTripById);

router.put("/:id", protect, updateTrip);

router.patch("/:id", protect, updateTrip);

router.delete("/:id", protect, deleteTrip);

module.exports = router;