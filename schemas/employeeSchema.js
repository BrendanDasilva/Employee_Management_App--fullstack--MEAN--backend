const { gql } = require("apollo-server-express");

const employeeTypeDefs = gql`
  scalar Upload

  type Employee {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
    created_at: String!
    updated_at: String!
  }

  type Query {
    getAllemployees: [Employee]
    getEmployeeByEID(id: ID!): Employee
    searchEmployees(designation: String, department: String): [Employee]
  }

  type Mutation {
    addEmployee(
      first_name: String!
      last_name: String!
      email: String!
      gender: String!
      designation: String!
      salary: Float!
      date_of_joining: String!
      department: String!
      employee_photo: Upload
    ): Employee

    updateEmployee(
      id: ID!
      first_name: String
      last_name: String
      email: String
      designation: String
      salary: Float
      department: String
      employee_photo: Upload
    ): Employee

    deleteEmployee(id: ID!): String
  }
`;

module.exports = employeeTypeDefs;
