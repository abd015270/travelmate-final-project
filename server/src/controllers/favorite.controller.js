const Favorite = require("../models/Favorite");

const addFavorite = async (req, res) => {
  try {
    const exists = await Favorite.findOne({
      user: req.user._id,
      trip: req.params.tripId,
    });

    if (exists) {
      return res.status(400).json({
        message: "trip already in favorites",
      });
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      trip: req.params.tripId,
    });

    res.status(201).json(favorite);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({
      user: req.user._id,
    }).populate("trip");

    res.json(favorites);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      user: req.user._id,
      trip: req.params.tripId,
    });

    if (!favorite) {
      return res.status(404).json({
        message: "favorite not found",
      });
    }

    res.json({
      message: "favorite deleted",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  addFavorite,
  getFavorites,
  deleteFavorite,
};