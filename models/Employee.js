const mongoose = require("mongoose");
const { updateMany } = require("./User");

// employee schema
const EmployeeSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  designation: { type: String, required: true },
  salary: { type: Number, required: true, min: 1000 },
  date_of_joining: { type: Date, required: true },
  department: { type: String, required: true },
  employee_photo: {
    type: String,
    validate: {
      validator: function (value) {
        return /\.(jpg|jpeg|png|gif)$/i.test(value);
      },
      message: "Invalid image file format.",
    },
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// export model employee with EmployeeSchema
module.exports = mongoose.model("Employee", EmployeeSchema);
