const Trip = require("../models/Trip");

const createTrip = async (req, res) => {
  try {
    const trip = await Trip.create(req.body);

    res.status(201).json(trip);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getTrips = async (req, res) => {
  try {
    let filter = {};

    if (req.query.city) {
      filter.city = req.query.city;
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    let trips = Trip.find(filter);

    if (req.query.sort === "price") {
      trips = trips.sort({ price: 1 });
    }

    if (req.query.limit) {
      trips = trips.limit(parseInt(req.query.limit));
    }

    const result = await trips;

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        message: "trip not found",
      });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.json(trip);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const deleteTrip = async (req, res) => {
  try {
    await Trip.findByIdAndDelete(req.params.id);

    res.json({
      message: "trip deleted",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
};