const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const adminOnly = require("../middlewares/admin.middleware");

const {
  getTrips,
  getAllTripsForAdmin,
  getExpiredTrips,
  createTrip,
  updateTrip,
  deleteTrip,
  deleteAllTrips,
} = require("../controllers/trip.controller");

router.get("/", getTrips);

router.get("/admin/all", protect, adminOnly, getAllTripsForAdmin);

router.get("/expired/list", protect, adminOnly, getExpiredTrips);

router.post("/", protect, adminOnly, createTrip);

router.patch("/:id", protect, adminOnly, updateTrip);

router.delete("/admin/all", protect, adminOnly, deleteAllTrips);

router.delete("/:id", protect, adminOnly, deleteTrip);

module.exports = router;