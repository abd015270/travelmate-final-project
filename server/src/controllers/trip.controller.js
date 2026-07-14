const Trip = require("../models/Trip");

const getIsraelNow = () => {
  const now = new Date();

  return new Date(
    now.toLocaleString("en-US", {
      timeZone: "Asia/Jerusalem",
    })
  );
};

const buildTripDateTime = (date, time) => {
  const tripDate = new Date(date);
  const datePart = tripDate.toISOString().split("T")[0];

  return new Date(`${datePart}T${time || "00:00"}:00`);
};

const getCategory = (price, days) => {
  if (Number(days) >= 30) {
    return "Adventure";
  }

  if (Number(price) > 1000) {
    return "Luxury";
  }

  return "Standard";
};

const getTrips = async (req, res) => {
  try {
    const nowIsrael = getIsraelNow();

    const allTrips = await Trip.find().sort({ departureDate: 1 });

    const activeTrips = allTrips.filter((trip) => {
      const tripDateTime = buildTripDateTime(
        trip.departureDate,
        trip.departureTime
      );

      return tripDateTime > nowIsrael;
    });

    res.json(activeTrips);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllTripsForAdmin = async (req, res) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 });

    res.json(trips);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getExpiredTrips = async (req, res) => {
  try {
    const nowIsrael = getIsraelNow();

    const allTrips = await Trip.find().sort({ departureDate: -1 });

    const expiredTrips = allTrips.filter((trip) => {
      const tripDateTime = buildTripDateTime(
        trip.departureDate,
        trip.departureTime
      );

      return tripDateTime <= nowIsrael;
    });

    res.json(expiredTrips);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createTrip = async (req, res) => {
  try {
    const tripData = {
      ...req.body,
      category: getCategory(req.body.price, req.body.days),
    };

    const trip = await Trip.create(tripData);

    res.status(201).json(trip);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const updateTrip = async (req, res) => {
  try {
    const updatedData = {
      ...req.body,
    };

    if (req.body.price || req.body.days) {
      updatedData.category = getCategory(req.body.price, req.body.days);
    }

    const trip = await Trip.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!trip) {
      return res.status(404).json({
        message: "trip not found",
      });
    }

    res.json(trip);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);

    if (!trip) {
      return res.status(404).json({
        message: "trip not found",
      });
    }

    res.json({
      message: "trip deleted",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const deleteAllTrips = async (req, res) => {
  try {
    await Trip.deleteMany();

    res.json({
      message: "all trips deleted",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  getTrips,
  getAllTripsForAdmin,
  getExpiredTrips,
  createTrip,
  updateTrip,
  deleteTrip,
  deleteAllTrips,
};