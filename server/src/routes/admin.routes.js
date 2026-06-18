const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const adminOnly = require("../middlewares/admin.middleware");

const {
  getAllUsers,
  getUserDetails,
} = require("../controllers/admin.controller");

router.get("/users", protect, adminOnly, getAllUsers);

router.get("/users/:id", protect, adminOnly, getUserDetails);

module.exports = router;