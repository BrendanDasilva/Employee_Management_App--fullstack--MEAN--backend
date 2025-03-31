const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const validator = require("validator");

module.exports = {
  Query: {
    me: async (_, __, { req }) => {
      try {
        const token = req.cookies.token;
        if (!token) return null;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        return user;
      } catch (error) {
        return null;
      }
    },
  },

  Mutation: {
    signup: async (_, { username, email, password }) => {
      try {
        // Normalize inputs
        username = username.trim().toLowerCase();
        email = email.trim().toLowerCase();

        // Validate required fields
        if (!username || !email || !password) {
          throw new Error("Username, email, and password are required.");
        }

        // Username validation
        if (username.length < 3 || username.length > 25) {
          throw new Error("Username must be between 3 and 25 characters.");
        }

        // Email format
        if (!validator.isEmail(email)) {
          throw new Error("Invalid email format.");
        }

        // Password strength
        if (!validator.isLength(password, { min: 6 }) || !/\d/.test(password)) {
          throw new Error(
            "Password must be at least 6 characters long and contain at least one number."
          );
        }

        // Check uniqueness
        const existingUser = await User.findOne({
          $or: [{ username }, { email }],
        });
        if (existingUser) {
          throw new Error("Username or email already in use.");
        }

        // Hash and save
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });

        return await user.save();
      } catch (error) {
        console.error(`Error during signup: ${error.message}`);
        throw new Error(error.message);
      }
    },

    login: async (_, { username, password }, { res }) => {
      try {
        if (!username || !password) {
          throw new Error("Username and password are required.");
        }

        username = username.toLowerCase().trim();
        const user = await User.findOne({ username });
        if (!user) throw new Error("Invalid username or password.");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid username or password.");

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });

        // HttpOnly cookie
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        return { token, user };
      } catch (error) {
        console.error(`Error during login: ${error.message}`);
        throw new Error(error.message);
      }
    },

    logout: async (_, __, { res, req }) => {
      try {
        if (!req.cookies.token) {
          throw new Error("No active session");
        }

        res.clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
        });

        return true;
      } catch (error) {
        console.error(`Logout error: ${error.message}`);
        throw new Error(error.message);
      }
    },
  },
};
