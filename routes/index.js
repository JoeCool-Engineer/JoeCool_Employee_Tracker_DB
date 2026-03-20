const { viewDepartments, addDepartment } = require('./departments');
const { addRole, viewRoles } = require('./roles');
const { addEmployee, viewEmployees, updateEmployeeRole } = require('./employees');

module.exports = {
  viewDepartments,
  addDepartment,
  addRole,
  viewRoles,
  addEmployee,
  viewEmployees,
  updateEmployeeRole,
};
