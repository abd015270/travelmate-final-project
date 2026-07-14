const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const fullNameRegex = /^[A-Za-z\u0590-\u05FF\u0600-\u06FF\s]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nationalIdRegex = /^\d{9}$/;
const phoneRegex = /^05\d{8}$/;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/;

const calculateAge = (date) => {
  const birthDate = new Date(date);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age;
};

const userSchema = mongoose.Schema(
  {
    nationalId: {
      type: String,
      required: [true, "National ID is required"],
      unique: true,
      trim: true,
      validate: {
        validator: (value) => nationalIdRegex.test(value),
        message: "National ID must contain exactly 9 digits",
      },
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      validate: [
        {
          validator: (value) => fullNameRegex.test(value),
          message: "Full name must contain letters only",
        },
        {
          validator: (value) =>
            value.replace(/\s/g, "").length >= 8,
          message: "Full name must contain at least 8 letters",
        },
      ],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => emailRegex.test(value),
        message: "Please enter a valid email address",
      },
    },

    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
      validate: {
        validator: (value) => phoneRegex.test(value),
        message:
          "Phone number must start with 05 and contain exactly 10 digits",
      },
    },

    birthDate: {
      type: Date,
      required: [true, "Birth date is required"],
      validate: {
        validator: (value) => calculateAge(value) >= 18,
        message: "User must be at least 18 years old",
      },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must contain at least 8 characters"],
      select: false,
      validate: {
        validator: (value) => passwordRegex.test(value),
        message:
          "Password must include uppercase, lowercase, number, and special symbol",
      },
    },

    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "Role must be user or admin",
      },
      default: "user",
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