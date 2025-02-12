const mongoose = require("mongoose");
const validator = require("validator"); // replaces regex for email validation

// user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [, "Username is required"],
    unique: true,
    maxlength: [25, "Username cannot be more than 25 characters"],
    match: [/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password cannot be less than 6 characters"],
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

userSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

// export model user with UserSchema
module.exports = mongoose.model("User", userSchema);
