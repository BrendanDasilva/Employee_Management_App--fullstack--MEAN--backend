const mongoose = require("mongoose");
const validator = require("validator"); // replaces regex for email validation

// employee schema
const EmployeeSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "First name is required"],
    maxlength: [25, "First name cannot exceed 25 characters"],
    match: [/^[a-zA-Z]+$/, "First name can only contain letters"],
    trim: true,
  },
  last_name: {
    type: String,
    required: [true, "Last name is required"],
    maxlength: [25, "Last name cannot exceed 25 characters"],
    match: [/^[a-zA-Z]+$/, "Last name can only contain letters"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email address"],
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: [true, "Gender is required"],
  },
  designation: {
    type: String,
    required: [true, "Designation is required"],
    maxlength: [50, "Designation cannot exceed 50 characters"],
    trim: true,
  },
  salary: {
    type: Number,
    required: [true, "Salary is required"],
    min: [1000, "Salary must be at least 1000"],
    max: [1000000, "Salary cannot exceed 1000000"],
  },
  date_of_joining: {
    type: Date,
    required: [true, "Date of joining is required"],
    validate: {
      validator: function (value) {
        return value <= new Date();
      },
      message: "Date of joining cannot be a future date.",
    },
  },
  department: {
    type: String,
    required: [true, "Department is required"],
    maxlength: [50, "Department cannot exceed 50 characters"],
    trim: true,
  },
  employee_photo: {
    type: String,
    validate: {
      validator: function (value) {
        return /\.(jpg|jpeg|png|gif)$/i.test(value);
      },
      message:
        "Invalid image file format. Only JPG, JPEG, PNG, and GIF are allowed.",
    },
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// middleware to update the updated_at field before saving changes
EmployeeSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

// export model employee with EmployeeSchema
module.exports = mongoose.model("Employee", EmployeeSchema);
