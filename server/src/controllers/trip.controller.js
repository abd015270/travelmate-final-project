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
    const today = new Date();

    let filter = {
      returnDate: {
        $gte: today,
      },
    };

    if (req.query.city) {
      filter.city = req.query.city;
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.airline) {
      filter.airline = req.query.airline;
    }

    let trips = Trip.find(filter);

    if (req.query.search) {
      filter.$or = [
        {
          title: {
            $regex: req.query.search,
            $options: "i",
          },
        },
        {
          city: {
            $regex: req.query.search,
            $options: "i",
          },
        },
      ];

      trips = Trip.find(filter);
    }

    if (req.query.sort === "price") {
      trips = trips.sort({ price: 1 });
    }

    if (req.query.skip) {
      trips = trips.skip(parseInt(req.query.skip));
    }

    if (req.query.limit) {
      trips = trips.limit(parseInt(req.query.limit));
    }

    const result = await trips.select("-__v");

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getExpiredTrips = async (req, res) => {
  try {
    const today = new Date();

    const trips = await Trip.find({
      returnDate: {
        $lt: today,
      },
    }).sort({ returnDate: -1 });

    res.json(trips);
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
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
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

const getTripStats = async (req, res) => {
  try {
    const stats = await Trip.aggregate([
      {
        $group: {
          _id: "$category",
          count: {
            $sum: 1,
          },
          averagePrice: {
            $avg: "$price",
          },
          maxPrice: {
            $max: "$price",
          },
          minPrice: {
            $min: "$price",
          },
        },
      },
      {
        $sort: {
          averagePrice: 1,
        },
      },
      {
        $limit: 10,
      },
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createTrip,
  getTrips,
  getExpiredTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getTripStats,
};