const db = require('./db/connection');
// Import and require mysql2
const inquirer = require('inquirer');
// const { viewDepartments, addDepartment, addRole, viewRoles } = require('./routes/index');

// Create an array of questions for user input
const questions = [
['list', 'init', 'What would you like to do?', ['View all Employees', 'Add Employee', 'Update Employee Role', 'View All Role', 'Add Role', 'View All Departments', 'Add Department', 'Quit']]
];  

const menu = () => {
inquirer.prompt(questions.map((question) => ({
    type: question[0],
    name: question[1],
    message: question[2],
    choices: question[3],
})))
.then((userResponse) => { 
// if Statements for routing
    // console.log(userResponse.init)
    const choice = userResponse.init;
    if ( choice === 'View All Departments') {
        // console.log('Run the viewDepartments function!')
        viewDepartments()
    } else if ( choice === 'Add Department') {
        // console.log('Run the addDepartment function!')
        addDepartment()
    } else if ( choice === 'View All Role') {
        // console.log('User wants to view all roles')
        viewRoles()
    } else if ( choice === 'Add Role') {
        // console.log('User selected to add a role')
        addRole()
    } else if ( choice === 'View all Employees') {
        // console.log('User wants to view all employees')  
        viewEmployees ()
    } else if ( choice === 'Add Employee') {
        // console.log('User wants to add an employee')
        // sql = `INSERT INTO employee (first_name, last_name, )`;
        addEmployee()
    } else if ( choice === 'Update Employee Role') {
        // console.log('User selected to update an employee profile')
    } else if ( choice === 'Quit') { 
        console.log('Good Bye!') 
        process.exit(0)
    } else {
        console.log("I entered a state that I don't know what to do")
    } 
})
}

// Create a Department
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
            menu()
          })
    });
  }

// View All Departments
function viewDepartments () {
    const sql = `SELECT * FROM departments`;
    console.log('Executed viewDepartments Function')
//   Views the departments table
    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.log('\n') // To print the table on the next row.
        console.table(results);
        console.log('\n');
    })
    menu()
  }

// Create a Role
function addRole() {
	let name = [];
	let nameId;
	const deptSql = `SELECT * FROM departments`;
	db.query(deptSql, (err, results) => {
		if (err) {
			console.log(err);
		}

		// console.log('results', results);

		name = results.map((result) => ({ name: result.dept, value: result.id }));

		// console.log('This is the list of departments: ', name);

		const questions = [
			['input', 'addRole', 'What is the name of the role?'],
			['input', 'addSalary', 'What is the Salary of the role?'],
			['list', 'assignDept', 'Which department does the role belong to?', name],
		];

		inquirer
			.prompt(
				questions.map((question) => ({
					type: question[0],
					name: question[1],
					message: question[2],
					choices: question[3],
				}))
			)
			.then((usersResponse) => {
				console.log('usersResponse', usersResponse);
				const sql = `INSERT INTO roles (title, salary, department_id) VALUES ('${usersResponse.addRole}',${usersResponse.addSalary}, ${usersResponse.assignDept})`;
				const addRole = usersResponse.addRole;
				const addSalary = usersResponse.addSalary;
				// Add Role and Salary to table
				db.query(sql, (addRole, addSalary), (err, result) => {
					if (err) {
						console.log(err);
					}
					// console.log('Role inserted with Id: ', result.insertId);
					menu();
				});
			});
	});
}

// View All Roles
function viewRoles () {
    const sql = `SELECT * FROM roles`;
    console.log('Executed viewRoles Function')
//   Views the departments table
    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.log('\n'); // To print the table on the next row.
        console.table(results);
        console.log('\n');
    })
    menu()
  }

function viewEmployees () {
    const sql = `SELECT * FROM employees`
    db.query(sql, (err, results) => {
        if (err){
            console.log(err);
        }
        console.log('\n') // To print the table on the next row.
        console.table(results);
        console.log('\n')
    })
    menu()
}

// Create a Employee
function addEmployee() {
	let name = [];
	let nameId;
	const roleSql = `SELECT * FROM roles`;
	db.query(roleSql, (err, results) => {
		if (err) {
			console.log(err);
		}

		// console.log('results', results);

		// for (i = 0; i < results.length; i++) {
		// 	name.push(results[i].dept);
		// 	// nameId = results.id
		// }
		name = results.map((result) => ({ name: result.title, value: result.id }));

		// console.log('This is the list of roles: ', name);

		const questions = [
			['input', 'addEmployeeFirst', 'What is the employee\'s first name?'],
            ['input', 'addEmployeeLast', 'What is the employee\'s last name?'],
			['list', 'assignRole', 'What is the employee\'s role?', name],
			['input', 'assignManger', 'Who is the mangager (Provide ID)?'],
		];

		inquirer
			.prompt(
				questions.map((question) => ({
					type: question[0],
					name: question[1],
					message: question[2],
					choices: question[3],
				}))
			)
			.then((usersResponse) => {
				console.log('usersResponse', usersResponse);
				const sql = `INSERT INTO employees (first_name, last_name, role_id) VALUES ('${usersResponse.addEmployeeFirst}',${usersResponse.addEmployeeLast}, ${usersResponse.assignRole})`;
				const addEmployeeFirst = usersResponse.addEmployeeFirst;
				const addEmployeeLast = usersResponse.addEmployeeLast;
				
				// Add Role and Salary to table
				db.query(sql, (addEmployeeFirst, addEmployeeLast), (err, result) => {
					if (err) {
						console.log(err);
					}
					// console.log('Role inserted with Id: ', result.insertId);
					menu();
				});
			});
	});
}

menu()

// module.exports = { menu }