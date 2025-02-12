const Employee = require("../models/Employee");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

// employee resolver
module.exports = {
  Query: {
    getAllemployees: async () => {
      return await Employee.find();
    },
    getEmployeeByEID: async (_, { id }) => {
      const employee = await Employee.findById(id);

      if (!employee) {
        throw new Error(`Employee with ID ${id} not found.`);
      }
      return employee;
    },
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

  Mutation: {
    // this is a simplified version for including file uploads and will have to be updated once the frontend is built out
    addEmployee: async (_, args, { req }) => {
      try {
        // normalize input
        args.first_name = args.first_name.trim();
        args.last_name = args.last_name.trim();
        args.email = args.email.toLowerCase().trim();

        // check if an image was uploaded
        if (req.file) {
          const allowedExtensions = /\.(jpg|jpeg|png|gif)$/i;
          if (!allowedExtensions.test(req.file.filename)) {
            throw new Error(
              "Invalid image file format. Only JPG, JPEG, PNG, and GIF are allowed."
            );
          }
          args.employee_photo = `uploads/employees/${req.file.filename}`;
        }

        // ensure all required fields are provided
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

        // check if the email already exists
        const existingEmployee = await Employee.findOne({ email: args.email });
        if (existingEmployee) {
          throw new Error(`Employee with email ${args.email} already exists.`);
        }

        const employee = new Employee(args);
        return await employee.save();
      } catch (error) {
        console.error(`Error adding employee: ${error.message}`);
        throw new Error(`Error adding employee: ${error.message}`);
      }
    },
    updateEmployee: async (_, { id, ...args }) => {
      try {
        // check if the employee exists
        const employee = await Employee.findById(id);
        if (!employee) {
          throw new Error(`Employee with ID ${id} not found.`);
        }

        // normalize input
        if (args.first_name) args.first_name = args.first_name.trim();
        if (args.last_name) args.last_name = args.last_name.trim();
        if (args.email) args.email = args.email.toLowerCase().trim();

        // update the employee
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
    deleteEmployee: async (_, { id }) => {
      try {
        // validate mongoDB object id
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error(`Invalid employee ID: ${id}`);
        }

        // check if the employee exists
        const employee = await Employee.findById(id);
        if (!employee) {
          throw new Error(`Employee with ID ${id} not found.`);
        }

        await Employee.findByIdAndDelete(id);
        return `Employee with ID ${id} has been deleted successfully.`;
      } catch (error) {
        console.error(`Error deleting employee: ${error.message}`);
        throw new Error(error.message);
      }
    },
  },
};
