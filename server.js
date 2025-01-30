const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const connectDB = require("./config/db");
const upload = require("./middlewares/upload");
require("dotenv").config({ path: "./config.env" });

// Initialize Express
const app = express();
connectDB();

// Use the upload middleware
app.use("/uploads", express.static("uploads"));

// REST API route for image uploads (for Postman testing)
app.post("/upload", upload.single("employee_photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({ filePath: `uploads/employees/${req.file.filename}` });
});

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
  context: ({ req }) => ({ req }),
});

// Start Apollo Server
server.start().then(() => {
  server.applyMiddleware({ app });
  app.listen(4000, () =>
    console.log("Server running on http://localhost:4000/graphql")
  );
});
