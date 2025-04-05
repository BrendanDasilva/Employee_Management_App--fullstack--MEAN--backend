// ========================
// Dependencies
// ========================
const mongoose = require("mongoose");
const validator = require("validator"); // Used for email format validation

// ========================
// User Schema Definition
// ========================
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"], // Custom error message
    unique: true, // Ensure username is unique
    maxlength: [25, "Username cannot be more than 25 characters"],
    match: [/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers"], // Alphanumeric constraint
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true, // Automatically convert to lowercase
    validate: [validator.isEmail, "Please enter a valid email address"], // Uses validator lib for email format
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password cannot be less than 6 characters"],
    validate: {
      validator: function (value) {
        return /\d/.test(value); // Ensures at least one number exists in password
      },
      message: "Password must contain at least one number",
    },
  },
  created_at: {
    type: Date,
    default: Date.now, // Automatically set at creation time
  },
  updated_at: {
    type: Date,
    default: Date.now, // Will be updated with each save via pre-save hook
  },
});

// ========================
// Middleware
// ========================

// Pre-save hook: Automatically update the `updated_at` field before saving
userSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

// ========================
// Export Model
// ========================
module.exports = mongoose.model("User", userSchema);
