// ========================
// Dependencies
// ========================
const Employee = require("../models/Employee"); // Mongoose model for Employee
const fs = require("fs"); // File system for deleting old photos
const path = require("path"); // Path utilities
const mongoose = require("mongoose"); // To validate ObjectId

// ========================
// Employee GraphQL Resolvers
// ========================
module.exports = {
  // ------------------------
  // QUERY RESOLVERS
  // ------------------------
  Query: {
    // Get all employees
    getAllemployees: async () => {
      return await Employee.find();
    },

    // Get a single employee by MongoDB ObjectId
    getEmployeeByEID: async (_, { id }) => {
      const employee = await Employee.findById(id);
      if (!employee) {
        throw new Error(`Employee with ID ${id} not found.`);
      }
      return employee;
    },

    // Search employees by designation and/or department
    searchEmployees: async (_, { designation, department }) => {
      let filter = {};
      if (designation) filter.designation = designation;
      if (department) filter.department = department;

      const employees = await Employee.find(filter);
      if (employees.length === 0) {
        throw new Error("No employees found matching the search criteria.");
      }
      return employees;
    },
  },

  // ------------------------
  // MUTATION RESOLVERS
  // ------------------------
  Mutation: {
    // ===== ADD EMPLOYEE =====
    addEmployee: async (_, args, { req }) => {
      try {
        // Normalize basic inputs
        args.first_name = args.first_name.trim();
        args.last_name = args.last_name.trim();
        args.email = args.email.toLowerCase().trim();

        // Handle image upload (if provided)
        if (req.file) {
          args.employee_photo = `uploads/employees/${req.file.filename}`;
        }

        // Validate required fields
        const requiredFields = [
          "first_name",
          "last_name",
          "email",
          "gender",
          "designation",
          "salary",
          "date_of_joining",
          "department",
        ];
        for (const field of requiredFields) {
          if (!args[field]) {
            throw new Error(`${field} is required.`);
          }
        }

        // Ensure email is unique
        const existingEmployee = await Employee.findOne({ email: args.email });
        if (existingEmployee) {
          throw new Error(`Employee with email ${args.email} already exists.`);
        }

        // Save employee
        const employee = new Employee(args);
        return await employee.save();
      } catch (error) {
        console.error(`Error adding employee: ${error.message}`);
        throw new Error(`Error adding employee: ${error.message}`);
      }
    },

    // ===== UPDATE EMPLOYEE =====
    updateEmployee: async (_, { id, ...args }, { req }) => {
      try {
        const employee = await Employee.findById(id);
        if (!employee) {
          throw new Error(`Employee with ID ${id} not found.`);
        }

        // Handle file upload (replace old photo if exists)
        if (req.file) {
          if (employee.employee_photo) {
            const oldPhotoPath = path.join(
              __dirname,
              "..",
              employee.employee_photo
            );
            if (fs.existsSync(oldPhotoPath)) fs.unlinkSync(oldPhotoPath);
          }
          args.employee_photo = `uploads/employees/${req.file.filename}`;
        }

        // Normalize updated fields
        if (args.first_name) args.first_name = args.first_name.trim();
        if (args.last_name) args.last_name = args.last_name.trim();
        if (args.email) args.email = args.email.toLowerCase().trim();

        // Update and return the new employee document
        const updatedEmployee = await Employee.findByIdAndUpdate(id, args, {
          new: true,
        });

        if (!updatedEmployee) {
          throw new Error("Error updating employee. Please try again.");
        }

        return updatedEmployee;
      } catch (error) {
        console.error(`Error updating employee: ${error.message}`);
        throw new Error(`Error updating employee: ${error.message}`);
      }
    },

    // ===== DELETE EMPLOYEE =====
    deleteEmployee: async (_, { id }) => {
      try {
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error(`Invalid employee ID: ${id}`);
        }

        const employee = await Employee.findById(id);
        if (!employee) {
          throw new Error(`Employee with ID ${id} not found.`);
        }

        // Delete employee from DB
        await Employee.findByIdAndDelete(id);
        return `Employee with ID ${id} has been deleted successfully.`;
      } catch (error) {
        console.error(`Error deleting employee: ${error.message}`);
        throw new Error(error.message);
      }
    },
  },
};
