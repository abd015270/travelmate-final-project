const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const adminOnly = require("../middlewares/admin.middleware");

const {
  createTrip,
  getTrips,
  getExpiredTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getTripStats,
} = require("../controllers/trip.controller");

router.get("/", getTrips);

router.get("/expired/list", protect, adminOnly, getExpiredTrips);

router.get("/stats/summary", getTripStats);

router.get("/:id", getTripById);

router.post("/", protect, adminOnly, createTrip);

router.put("/:id", protect, adminOnly, updateTrip);

router.patch("/:id", protect, adminOnly, updateTrip);

router.delete("/:id", protect, adminOnly, deleteTrip);

module.exports = router;