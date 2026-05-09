const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const {
  addFavorite,
  getFavorites,
  deleteFavorite,
} = require("../controllers/favorite.controller");

router.post("/:tripId", protect, addFavorite);

router.get("/", protect, getFavorites);

router.delete("/:tripId", protect, deleteFavorite);

module.exports = router;