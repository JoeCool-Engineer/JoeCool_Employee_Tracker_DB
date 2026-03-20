const db = require('../db/connection');

// Input validation helpers
function validateInput(input, fieldName) {
  if (!input || input.trim() === '') {
    console.log(`\n Error: ${fieldName} cannot be empty. Please try again.\n`);
    return false;
  }
  return true;
}

function validateNumber(input, fieldName) {
  const num = parseFloat(input);
  if (isNaN(num) || num <= 0) {
    console.log(`\n Error: ${fieldName} must be a valid positive number. Please try again.\n`);
    return false;
  }
  return true;
}

function formatSalary(value) {
  const salary = Number.parseFloat(value);

  if (Number.isNaN(salary)) {
    return 'N/A';
  }

  return `$${salary.toFixed(2)}`;
}

// Create a Role
function addRole(callback) {
  let deptOptions = [];
  const deptSql = `SELECT * FROM departments`;
  db.query(deptSql, (err, results) => {
    if (err) {
      console.log('\n Error fetching departments:', err.message);
      callback();
      return;
    }

    if (!results || results.length === 0) {
      console.log('\n  No departments found. Please add a department first.\n');
      callback();
      return;
    }

    deptOptions = results.map((result) => ({ name: result.dept, value: result.id }));

    const inquirer = require('inquirer');
    const questions = [
      ['input', 'addRoleTitle', 'What is the name of the role?'],
      ['input', 'addRoleSalary', 'What is the salary of the role?'],
      ['list', 'assignDept', 'Which department does the role belong to?', deptOptions]
    ];

    inquirer.prompt(questions.map((question) => ({
      type: question[0],
      name: question[1],
      message: question[2],
      choices: question[3],
    })))
    .then((userResponse) => {
      // Validate inputs
      if (!validateInput(userResponse.addRoleTitle, 'Role title')) {
        addRole(callback);
        return;
      }
      if (!validateNumber(userResponse.addRoleSalary, 'Salary')) {
        addRole(callback);
        return;
      }

      const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
      const params = [userResponse.addRoleTitle.trim(), parseFloat(userResponse.addRoleSalary), userResponse.assignDept];

      db.query(sql, params, (err, result) => {
        if (err) {
          console.log('\n Error adding role:', err.message);
          callback();
          return;
        }
        console.log('\n Role added successfully! ID:', result.insertId, '\n');
        callback();
      });
    })
    .catch((err) => {
      console.log('\n Error with input:', err.message);
      callback();
    });
  });
}

// View all Roles
function viewRoles(callback) {
  const sql = `
    SELECT roles.id, roles.title, roles.salary, departments.dept AS department
    FROM roles
    LEFT JOIN departments ON roles.department_id = departments.id
    ORDER BY roles.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.log('\n Error fetching roles:', err.message);
      callback();
      return;
    }

    if (!results || results.length === 0) {
      console.log('\n No roles found.\n');
      callback();
      return;
    }

    console.log('\n--- All Roles ---\n');
    console.table(results.map(role => ({
      ID: role.id,
      Title: role.title,
      Salary: formatSalary(role.salary),
      Department: role.department || 'N/A'
    })));
    console.log('');
    callback();
  });
}

module.exports = {
  addRole,
  viewRoles
};
