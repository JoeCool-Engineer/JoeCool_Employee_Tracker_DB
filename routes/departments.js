// Create connection the sql schema 
const db = require("../db/connection");
const inquirer = require('inquirer');
// const { init } = require('../index');

// Create function to Add Departments
function addDepartment () {    
    // Prompt for handling the addDepartment function
    const questions = [
        ['input', 'addDept', 'What is the name of the department?']
        ];  

    inquirer.prompt(questions.map((question) => ({
        type: question[0],
        name: question[1],
        message: question[2],
    })))
    .then((userResponse) => {
        const sql = `INSERT INTO departments (dept) VALUES (?) `;
        const newDept = userResponse.addDept
        console.log(newDept);
        // Add departments through the db connection
          db.query(sql, newDept, (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log('Number of departments inserted: ', result.affectedRows);
            console.log('New Dapartment Id: ', result.insertId);
            // init();
          })
    });
  }

// Create function to View All Departments
function viewDepartments () {
    const sql = `SELECT * FROM departments`;
    console.log('Executed viewDepartments Function')
//   Views the departments table
    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
    })
  }

// Export functions for use back in the index file
module.exports = { viewDepartments, addDepartment }