const User = require("../models/User");
const Booking = require("../models/Booking");
const Favorite = require("../models/Favorite");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    const bookings = await Booking.find({
      user: req.params.id,
    }).populate("trip");

    const favorites = await Favorite.find({
      user: req.params.id,
    }).populate("trip");

    res.json({
      user,
      bookings,
      favorites,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserDetails,
};