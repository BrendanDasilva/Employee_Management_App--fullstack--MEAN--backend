// ========================
// Dependencies
// ========================
const multer = require("multer");
const path = require("path");

// ========================
// Storage Configuration
// ========================
// Tells Multer where and how to store the uploaded files
const storage = multer.diskStorage({
  // Directory to save uploaded files
  destination: function (req, file, cb) {
    cb(null, "uploads/employees/"); // Relative path from root
  },

  // Customize filename (e.g., photo-16789023498.jpg)
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname); // Preserve original extension
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

// ========================
// File Filter
// ========================
// Ensures only image uploads are allowed
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept image
  } else {
    cb(new Error("Invalid file type. Only image files are allowed."), false); // Reject other file types
  }
};

// ========================
// Multer Upload Middleware
// ========================
// Includes storage logic, file type validation, and size limit (5MB)
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter: fileFilter,
});

// ========================
// Export Middleware
// ========================
module.exports = upload;
