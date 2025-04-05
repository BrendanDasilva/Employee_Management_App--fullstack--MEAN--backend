// ========================
// Dependencies
// ========================
const bcrypt = require("bcryptjs"); // For hashing passwords
const jwt = require("jsonwebtoken"); // For signing/verifying JWT tokens
const User = require("../models/User"); // Mongoose User model
const validator = require("validator"); // For validating email, password strength, etc.

// ========================
// User Resolvers
// ========================
module.exports = {
  // ------------------------
  // Query Resolvers
  // ------------------------
  Query: {
    // "me" query: returns current logged-in user from Authorization header
    me: async (_, __, { req }) => {
      try {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.replace("Bearer ", ""); // Strip 'Bearer ' prefix
        if (!token) return null;

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode and verify
        const user = await User.findById(decoded.id); // Fetch user by ID
        return user;
      } catch (error) {
        return null; // Invalid or expired token
      }
    },
  },

  // ------------------------
  // Mutation Resolvers
  // ------------------------
  Mutation: {
    // ====== SIGNUP USER ======
    signup: async (_, { username, email, password }) => {
      try {
        // Normalize inputs
        username = username.trim().toLowerCase();
        email = email.trim().toLowerCase();

        // Validate required fields
        if (!username || !email || !password) {
          throw new Error("Username, email, and password are required.");
        }

        // Validate username length
        if (username.length < 3 || username.length > 25) {
          throw new Error("Username must be between 3 and 25 characters.");
        }

        // Validate email format
        if (!validator.isEmail(email)) {
          throw new Error("Invalid email format.");
        }

        // Password must be strong (at least 6 chars + a number)
        if (!validator.isLength(password, { min: 6 }) || !/\d/.test(password)) {
          throw new Error(
            "Password must be at least 6 characters long and contain at least one number."
          );
        }

        // Ensure username/email is unique
        const existingUser = await User.findOne({
          $or: [{ username }, { email }],
        });
        if (existingUser) {
          throw new Error("Username or email already in use.");
        }

        // Hash password and save user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        return await user.save();
      } catch (error) {
        console.error(`Error during signup: ${error.message}`);
        throw new Error(error.message);
      }
    },

    // ====== LOGIN USER ======
    login: async (_, { username, password }) => {
      try {
        // Ensure both fields exist
        if (!username || !password) {
          throw new Error("Username and password are required.");
        }

        // Normalize and fetch user
        username = username.toLowerCase().trim();
        const user = await User.findOne({ username });
        if (!user) throw new Error("Invalid username or password.");

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid username or password.");

        // Generate a JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "1d", // 1 day token validity
        });

        // Return both user info and token
        return { token, user };
      } catch (error) {
        console.error(`Error during login: ${error.message}`);
        throw new Error(error.message);
      }
    },

    // ====== LOGOUT (no-op for token-based auth) ======
    logout: async () => {
      return true; // Just a placeholder - client can delete token from storage
    },
  },
};
