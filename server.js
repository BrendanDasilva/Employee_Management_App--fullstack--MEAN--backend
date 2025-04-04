const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { graphqlUploadExpress } = require("graphql-upload");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { GraphQLUpload } = require("graphql-upload");
const upload = require("./middlewares/upload");

// Load .env config
dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT || 4000;

const app = express();
connectDB();

// CORS and JSON/body/cookie middleware
app.use(
  cors({
    origin: [
      "http://localhost:4200",
      "https://employee-management-app-101447806.vercel.app",
    ],
    credentials: true,
  })
);
app.use(graphqlUploadExpress({ maxFileSize: 5 * 1024 * 1024, maxFiles: 1 }));

app.use(express.json());
app.use(cookieParser());

// Static image route
app.use("/uploads", express.static("uploads"));

// Combine typeDefs and resolvers
const schema = makeExecutableSchema({
  typeDefs: [
    require("./schemas/userSchema"),
    require("./schemas/employeeSchema"),
  ],
  resolvers: [
    { Upload: GraphQLUpload }, // Add the Upload resolver
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

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/graphql`);
  });
}

startServer();
