const inquirer = require('inquirer');
const {
  viewDepartments,
  addDepartment,
  addRole,
  viewRoles,
  addEmployee,
  viewEmployees,
  updateEmployeeRole,
} = require('./routes');

const questions = [
  [
    'list',
    'init',
    'What would you like to do?',
    [
      'View all Employees',
      'Add Employee',
      'Update Employee Role',
      'View All Role',
      'Add Role',
      'View All Departments',
      'Add Department',
      'Quit',
    ],
  ],
];

function menu() {
  inquirer
    .prompt(
      questions.map((question) => ({
        type: question[0],
        name: question[1],
        message: question[2],
        choices: question[3],
      }))
    )
    .then((userResponse) => {
      const choice = userResponse.init;

      if (choice === 'View All Departments') {
        viewDepartments(menu);
      } else if (choice === 'Add Department') {
        addDepartment(menu);
      } else if (choice === 'View All Role') {
        viewRoles(menu);
      } else if (choice === 'Add Role') {
        addRole(menu);
      } else if (choice === 'View all Employees') {
        viewEmployees(menu);
      } else if (choice === 'Add Employee') {
        addEmployee(menu);
      } else if (choice === 'Update Employee Role') {
        updateEmployeeRole(menu);
      } else if (choice === 'Quit') {
        console.log('Good Bye!');
        process.exit(0);
      } else {
        console.log("I entered a state that I don't know what to do");
        menu();
      }
    });
}

menu();

module.exports = { menu };
