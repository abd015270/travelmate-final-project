const Booking = require("../models/Booking");
const Trip = require("../models/Trip");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const createBooking = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);

    if (!trip) {
      return res.status(404).json({
        message: "trip not found",
      });
    }

    const seats = req.body.seats || 1;

    if (trip.availableSeats < seats) {
      return res.status(400).json({
        message: "not enough seats",
      });
    }

    trip.availableSeats = trip.availableSeats - seats;

    await trip.save();

    const booking = await Booking.create({
      user: req.user._id,
      trip: trip._id,
      seats: seats,
      totalPrice: trip.price * seats,
      status: "confirmed",
    });

    const user = await User.findById(req.user._id);

    await sendEmail(
      user.email,
      "TravelMate Booking",
      `Your booking for ${trip.title} has been confirmed. Seats: ${seats}. Total price: ${trip.price * seats}`
    );

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
    }).populate("trip");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getBookings,
};