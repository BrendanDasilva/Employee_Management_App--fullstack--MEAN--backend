// Import gql helper for defining schema strings
const { gql } = require("apollo-server-express");

// GraphQL Type Definitions related to Employee entity
const employeeTypeDefs = gql`
  # ===========================
  # Scalar for file upload
  # ===========================
  scalar Upload

  # ===========================
  # Employee Type Definition
  # ===========================
  type Employee {
    id: ID! # Unique identifier
    first_name: String! # First name of the employee
    last_name: String! # Last name
    email: String! # Email address
    gender: String! # Gender (e.g. 'Male', 'Female', 'Other')
    designation: String! # Job title
    salary: Float! # Salary (in float)
    date_of_joining: String! # ISO date of when the employee joined
    department: String! # Department (e.g. HR, Engineering)
    employee_photo: String # File path or URL to uploaded photo
    created_at: String! # Timestamp of creation
    updated_at: String! # Timestamp of last update
  }

  # ===========================
  # Queries - Data Retrieval
  # ===========================
  type Query {
    # Get all employee records
    getAllemployees: [Employee]

    # Get a single employee by ID
    getEmployeeByEID(id: ID!): Employee

    # Search employees by designation and/or department
    searchEmployees(designation: String, department: String): [Employee]
  }

  # ===========================
  # Mutations - Data Modification
  # ===========================
  type Mutation {
    # Add a new employee (supports optional photo upload)
    addEmployee(
      first_name: String!
      last_name: String!
      email: String!
      gender: String!
      designation: String!
      salary: Float!
      date_of_joining: String!
      department: String!
      employee_photo: Upload # Optional file input
    ): Employee

    # Update an employee's data (partial updates allowed)
    updateEmployee(
      id: ID!
      first_name: String
      last_name: String
      email: String
      designation: String
      salary: Float
      department: String
      employee_photo: Upload # Optional photo update
    ): Employee

    # Delete an employee by ID
    deleteEmployee(id: ID!): String
  }
`;

// Export schema to be consumed by Apollo Server
module.exports = employeeTypeDefs;
