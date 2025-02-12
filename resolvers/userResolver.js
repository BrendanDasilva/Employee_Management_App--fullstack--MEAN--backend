const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const validator = require("validator");

module.exports = {
  Query: {
    login: async (_, { username, password }) => {
      try {
        // ensure username and password are provided
        if (!username || !password) {
          throw new Error("Username and password are required.");
        }

        // convert username to lowercase to prevent case-sensitive issues
        username = username.toLowerCase().trim();

        // find user by username
        const user = await User.findOne({ username });
        if (!user) throw new Error("Invalid username or password.");

        // compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid username or password.");

        // generate JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });

        return { token, user };
      } catch (error) {
        console.error(`Error during login: ${error.message}`);
        throw new Error(error.message);
      }
    },
  },

  Mutation: {
    signup: async (_, { username, email, password }) => {
      try {
        // trim & normalize inputs
        username = username.trim().toLowerCase();
        email = email.trim().toLowerCase();

        // validate required fields
        if (!username || !email || !password) {
          throw new Error("Username, email, and password are required.");
        }

        // validate username length
        if (username.length < 3 || username.length > 25) {
          throw new Error("Username must be between 3 and 25 characters.");
        }

        // validate email format
        if (!validator.isEmail(email)) {
          throw new Error("Invalid email format.");
        }

        // validate password strength - future update i'd like to beef this up
        // even more by using isStrongPassword --> would have to update schema to
        // include more password requirements so I can use that here
        if (!validator.isLength(password, { min: 6 }) || !/\d/.test(password)) {
          throw new Error(
            "Password must be at least 6 characters long and contain at least one number."
          );
        }

        // check if email or username is already taken
        const existingUser = await User.findOne({
          $or: [{ username }, { email }],
        });
        if (existingUser) {
          throw new Error("Username or email already in use.");
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const user = new User({ username, email, password: hashedPassword });

        return await user.save();
      } catch (error) {
        console.error(`Error during signup: ${error.message}`);
        throw new Error(error.message);
      }
    },
  },
};
