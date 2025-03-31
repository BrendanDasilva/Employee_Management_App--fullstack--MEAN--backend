const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const upload = require("./middlewares/upload");

// Load .env config
dotenv.config({ path: "./config.env" });

const app = express();
connectDB();

// CORS and JSON/body/cookie middleware
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Static image route
app.use("/uploads", express.static("uploads"));

// Upload endpoint for testing with Postman
app.post("/upload", upload.single("employee_photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({ filePath: `uploads/employees/${req.file.filename}` });
});

// Combine typeDefs and resolvers
const schema = makeExecutableSchema({
  typeDefs: [
    require("./schemas/userSchema"),
    require("./schemas/employeeSchema"),
  ],
  resolvers: [
    require("./resolvers/userResolver"),
    require("./resolvers/employeeResolver"),
  ],
});

// Initialize Apollo Server
const server = new ApolloServer({
  schema,
});

async function startServer() {
  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res }),
    })
  );

  app.listen(4000, () => {
    console.log("Server running at http://localhost:4000/graphql");
  });
}

startServer();
