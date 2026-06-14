const Booking = require("../models/Booking");
const sendEmail = require("./sendEmail");

const checkTripReminders = async () => {
  try {
    const bookings = await Booking.find({
      status: "confirmed",
    })
      .populate("user")
      .populate("trip");

    const now = new Date();

    for (let i = 0; i < bookings.length; i++) {
      const booking = bookings[i];

      if (!booking.trip || !booking.user) {
        continue;
      }

      const departureDate = new Date(booking.trip.departureDate);

      const diffMs = departureDate - now;

      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours <= 24 && diffHours > 23) {
        await sendEmail(
          booking.user.email,
          "TravelMate Reminder",
          `Reminder: your trip ${booking.trip.title} is tomorrow.`
        );
      }

      if (diffHours <= 3 && diffHours > 2) {
        await sendEmail(
          booking.user.email,
          "TravelMate Reminder",
          `Reminder: your trip ${booking.trip.title} starts in 3 hours.`
        );
      }
    }
  } catch (error) {
    console.log("reminder error:", error.message);
  }
};

const startReminderService = () => {
  setInterval(() => {
    checkTripReminders();
  }, 60 * 60 * 1000);
};

module.exports = startReminderService;