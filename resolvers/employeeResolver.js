const Employee = require("../models/Employee");
const fs = require("fs");
const path = require("path");

// employee resolver
module.exports = {
  Query: {
    getAllemployees: async () => {
      return await Employee.find();
    },
    getEmployeeByEID: async (_, { id }) => {
      return await Employee.findById(id);
    },
    searchEmployees: async (_, { designation, department }) => {
      let filter = {};
      if (designation) filter.designation = designation;
      if (department) filter.department = department;
      return await Employee.find(filter);
    },
  },

  Mutation: {
    // this is a simplified version for including file uploads and will have to be updated once the frontend is built out
    addEmployee: async (_, args, { req }) => {
      if (req.file) {
        args.employee_photo = `uploads/employees/${req.file.filename}`;
      }
      const employee = new Employee(args);
      return await employee.save();
    },
    updateEmployee: async (_, { id, ...args }) => {
      return await Employee.findByIdAndUpdate(id, args, { new: true });
    },
    deleteEmployee: async (_, { id }) => {
      await Employee.findByIdAndDelete(id);
      return "Employee deleted successfully";
    },
  },
};
