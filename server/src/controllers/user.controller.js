const User = require("../models/User");

const getProfile = async (req, res) => {
  res.json(req.user);
};

const updateProfile = async (req, res) => {
  try {
    const allowedData = {
      fullName: req.body.fullName,
      email: req.body.email,
      nationalId: req.body.nationalId,
      phone: req.body.phone,
      birthDate: req.body.birthDate,
    };

    Object.keys(allowedData).forEach((key) => {
      if (allowedData[key] === undefined || allowedData[key] === "") {
        delete allowedData[key];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, allowedData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json(user);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const deleteProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);

    res.json({
      message: "profile deleted",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
};