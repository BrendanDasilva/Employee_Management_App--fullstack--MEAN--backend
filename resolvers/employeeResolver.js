const Employee = require("../models/Employee");

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
    addEmployee: async (_, args) => {
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
