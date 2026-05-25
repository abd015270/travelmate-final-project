const mongoose = require("mongoose");

const tripSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
    },

    city: {
      type: String,
      required: [true, "city is required"],
    },

    country: {
      type: String,
      required: [true, "country is required"],
    },

    description: {
      type: String,
      required: [true, "description is required"],
    },

    price: {
      type: Number,
      required: [true, "price is required"],
      min: [0, "price must be positive"],
    },

    image: {
      type: String,
      required: [true, "image is required"],
    },

    category: {
      type: String,
      required: [true, "category is required"],
    },

    airline: {
      type: String,
      required: [true, "airline is required"],
    },

    departureDate: {
      type: Date,
      required: [true, "departure date is required"],
    },

    returnDate: {
      type: Date,
      required: [true, "return date is required"],
    },

    days: {
      type: Number,
      required: [true, "days is required"],
      min: [1, "days must be at least 1"],
    },

    availableSeats: {
      type: Number,
      required: [true, "available seats is required"],
      min: [0, "available seats must be positive"],
    },

    location: {
      lat: {
        type: Number,
        required: [true, "latitude is required"],
      },
      lng: {
        type: Number,
        required: [true, "longitude is required"],
      },
    },
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;