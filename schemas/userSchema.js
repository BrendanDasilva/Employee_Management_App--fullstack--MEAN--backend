const { gql } = require("apollo-server-express");

// User type definitions - created_at and updated_at are of type String for now but i'd like to change them to Date using a custom scalar type
const userTypeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    created_at: String!
    updated_at: String!
  }

  type AuthPayload {
    token: String
    user: User
  }

  type Query {
    me: User
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): User
    login(username: String!, password: String!): AuthPayload
    logout: Boolean
  }
`;

// Export the userTypeDefs
module.exports = userTypeDefs;
