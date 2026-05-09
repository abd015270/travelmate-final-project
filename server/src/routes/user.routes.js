const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const {
  getProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/user.controller");

router.get("/profile", protect, getProfile);

router.patch("/profile", protect, updateProfile);

router.delete("/profile", protect, deleteProfile);

module.exports = router;