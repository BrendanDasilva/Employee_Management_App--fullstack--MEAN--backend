// Core server and Apollo GraphQL dependencies
const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { makeExecutableSchema } = require("@graphql-tools/schema");

// Upload handling for GraphQL
const { graphqlUploadExpress, GraphQLUpload } = require("graphql-upload");

// Middleware utilities
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

// Database connection helper
const connectDB = require("./config/db");

// Optional: Custom file upload middleware (if needed later)
const upload = require("./middlewares/upload");

// Load environment variables from config.env
dotenv.config({ path: "./config.env" });

// Port configuration (fallback to 4000 if not defined)
const PORT = process.env.PORT || 4000;

// Initialize Express app
const app = express();

// Connect to MongoDB via Mongoose
connectDB();

/**
 * Middleware configuration
 */

// Enable CORS with credentials support for frontend-hosted domains
app.use(
  cors({
    origin: [
      "http://localhost:4200",
      "https://employee-management-app-101447806.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
  })
);

// Enable multipart/form-data upload parsing for GraphQL
app.use(graphqlUploadExpress({ maxFileSize: 5 * 1024 * 1024, maxFiles: 1 }));

// Built-in middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to parse cookies for auth tokens
app.use(cookieParser());

// Serve uploaded files statically (i.e., /uploads/<filename>)
app.use("/uploads", express.static("uploads"));

/**
 * GraphQL schema setup
 */

// Combine all type definitions and resolvers into a single schema
const schema = makeExecutableSchema({
  typeDefs: [
    require("./schemas/userSchema"),
    require("./schemas/employeeSchema"),
  ],
  resolvers: [
    { Upload: GraphQLUpload }, // Explicitly declare Upload scalar
    require("./resolvers/userResolver"),
    require("./resolvers/employeeResolver"),
  ],
});

// Initialize Apollo Server with schema
const server = new ApolloServer({
  schema,
});

/**
 * Start the server asynchronously
 */
async function startServer() {
  // Start Apollo server instance
  await server.start();

  // Attach Apollo middleware to Express under /graphql endpoint
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res }), // Provide request context to resolvers
    })
  );

  // Start the HTTP server
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
  });
}

// Invoke the server start function
startServer();
