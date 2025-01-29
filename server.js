const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const connectDB = require("./config/db");
const { connect } = require("mongoose");
require("dotenv").config({ path: "./config.env" });

// Initialize Express
const app = express();
connectDB();

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs: [
    require("./schemas/userSchema"),
    require("./schemas/employeeSchema"),
  ],
  resolvers: [
    require("./resolvers/userResolver"),
    require("./resolvers/employeeResolver"),
  ],
});

// Start Apollo Server
server.start().then(() => {
  server.applyMiddleware({ app });
  app.listen(4000, () =>
    console.log("Server running on http://localhost:4000/graphql")
  );
});
