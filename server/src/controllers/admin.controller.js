const User = require("../models/User");
const Booking = require("../models/Booking");
const Favorite = require("../models/Favorite");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

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

const updateUserRole = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        role: req.body.role,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    await Booking.deleteMany({
      user: req.params.id,
    });

    await Favorite.deleteMany({
      user: req.params.id,
    });

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    res.json({
      message: "user deleted",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserDetails,
  updateUserRole,
  deleteUser,
};