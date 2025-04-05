// ========================
// MongoDB Connection Setup
// ========================

const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" }); // Load environment variables

// Async function to establish DB connection
const connectDB = async () => {
  try {
    // Attempt to connect using MONGO_URI from .env
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // Handle MongoDB connection string parsing
      useUnifiedTopology: true, // Use new connection engine
    });

    console.log("MongoDB connected!");
  } catch (error) {
    // Log the error and exit with failure code
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit process with failure
  }
};

// Export the function for use in server.js
module.exports = connectDB;
