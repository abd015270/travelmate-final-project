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
    },

    image: {
      type: String,
      required: [true, "image is required"],
    },

    category: {
      type: String,
      required: [true, "category is required"],
    },

    availableSeats: {
      type: Number,
      required: [true, "available seats is required"],
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