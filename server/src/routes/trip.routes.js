const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const adminOnly = require("../middlewares/admin.middleware");

const {
  createTrip,
  getTrips,
  getAdminTrips,
  getExpiredTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  deleteAllTrips,
  getTripStats,
} = require("../controllers/trip.controller");

router.get("/", getTrips);

router.get("/admin/all", protect, adminOnly, getAdminTrips);

router.get("/expired/list", protect, adminOnly, getExpiredTrips);

router.get("/stats/summary", getTripStats);

router.delete("/admin/all", protect, adminOnly, deleteAllTrips);

router.get("/:id", getTripById);

router.post("/", protect, adminOnly, createTrip);

router.put("/:id", protect, adminOnly, updateTrip);

router.patch("/:id", protect, adminOnly, updateTrip);

router.delete("/:id", protect, adminOnly, deleteTrip);

module.exports = router;