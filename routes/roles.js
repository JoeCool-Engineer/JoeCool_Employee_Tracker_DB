const db = require('../db/connection');
const inquirer = require('inquirer');
const { menu } = require('../index');

function addRole () {
    const questions = [['input', 'addRole', 'What is the name of the role?'], 
    ['input', 'addSalary', 'What is the Salary of the role?'],
    // ['list', 'assignDept', 'Which department does the role belong to?',[/* TODO Assign the departments here */ ]]
    ]

    inquirer.prompt(questions.map((question) => ({
        type: question[0],
        name: question[1],
        message: question[2],
        // choices: question[3],
    }))).then((usersResponse) => {
        const sql = `INSERT INTO roles (title, salary) VALUES ('${usersResponse.addRole}',${usersResponse.addSalary})`
        const addRole = usersResponse.addRole;
        const addSalary = usersResponse.addSalary;
        // Add Role and Salary to table
        db.query(sql, (addRole, addSalary), (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log(result)
        })
    })
    menu()
}

// Create function to View All Roles
function viewRoles () {
    const sql = `SELECT * FROM roles`;
    console.log('Executed viewRoles Function')
//   Views the roles table
    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
    })
    menu()
  }

// Export functions for use back in the index file
module.exports = { addRole, viewRoles }