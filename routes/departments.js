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
  const num = parseInt(input);
  if (isNaN(num) || num <= 0) {
    console.log(`\n Error: ${fieldName} must be a valid number. Please try again.\n`);
    return false;
  }
  return true;
}

// Create a Department
function addDepartment(callback) {
    const inquirer = require('inquirer');
    const questions = [
        ['input', 'addDept', 'What is the name of the department?']
    ];

    inquirer.prompt(questions.map((question) => ({
        type: question[0],
        name: question[1],
        message: question[2],
    })))
    .then((userResponse) => {
        // Validate input
        if (!validateInput(userResponse.addDept, 'Department name')) {
          addDepartment(callback);
          return;
        }

        const sql = `INSERT INTO departments (dept) VALUES (?) `;
        const newDept = userResponse.addDept.trim();

        // Add departments through the db connection
        db.query(sql, newDept, (err, result) => {
          if (err) {
            console.log('\n Error adding department:', err.message);
            callback();
            return;
          }
          console.log('\n Department added successfully! ID:', result.insertId, '\n');
          callback();
        });
    });
}

// View All Departments
function viewDepartments(callback) {
    const sql = `SELECT * FROM departments`;

    db.query(sql, (err, results) => {
        if (err) {
            console.log('\n Error fetching departments:', err.message);
            setTimeout(callback, 500);
            return;
        }

        if (!results || results.length === 0) {
          console.log('\n No departments found.\n');
          setTimeout(callback, 500);
          return;
        }

        console.log('\n--- DEPARTMENTS ---');
        console.table(results);
        console.log('');
        setTimeout(callback, 500);
    });
}

module.exports = { viewDepartments, addDepartment };