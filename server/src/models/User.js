const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    nationalId: {
      type: String,
      required: [true, "national id is required"],
      unique: true,
    },

    fullName: {
      type: String,
      required: [true, "full name is required"],
    },

    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },

    phone: {
      type: String,
      required: [true, "phone is required"],
    },

    birthDate: {
      type: Date,
      required: [true, "birth date is required"],
    },

    password: {
      type: String,
      required: [true, "password is required"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;