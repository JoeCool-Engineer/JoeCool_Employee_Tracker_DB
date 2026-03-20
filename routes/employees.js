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

// Create an Employee
function addEmployee(callback) {
	let roleOptions = [];
	const roleSql = `SELECT * FROM roles`;
	db.query(roleSql, (err, results) => {
		if (err) {
			console.log('\n Error fetching roles:', err.message);
			callback();
			return;
		}

		if (!results || results.length === 0) {
			console.log('\n  No roles found. Please add a role first.\n');
			callback();
			return;
		}

		roleOptions = results.map((result) => ({ name: result.title, value: result.id }));

		const inquirer = require('inquirer');
		const questions = [
			['input', 'addEmployeeFirst', 'What is the employee\'s first name?'],
            ['input', 'addEmployeeLast', 'What is the employee\'s last name?'],
			['list', 'assignRole', 'What is the employee\'s role?', roleOptions],
			['input', 'assignManager', 'Who is the manager (Provide ID, or leave blank if none)?'],
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
				// Validate inputs
				if (!validateInput(usersResponse.addEmployeeFirst, 'First name')) {
				  addEmployee(callback);
				  return;
				}
				if (!validateInput(usersResponse.addEmployeeLast, 'Last name')) {
				  addEmployee(callback);
				  return;
				}

				// Handle empty manager_id as NULL
				let managerId = null;
				if (usersResponse.assignManager && usersResponse.assignManager.trim() !== '') {
				  managerId = parseInt(usersResponse.assignManager);
				  if (isNaN(managerId) || managerId <= 0) {
				    console.log('\n Error: Manager ID must be a valid number.\n');
				    addEmployee(callback);
				    return;
				  }
				}

				const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
				const values = [usersResponse.addEmployeeFirst.trim(), usersResponse.addEmployeeLast.trim(), usersResponse.assignRole, managerId];

				// Add Employee to table
				db.query(sql, values, (err, result) => {
					if (err) {
						console.log('\n Error adding employee:', err.message);
						callback();
						return;
					}
					console.log('\n Employee added successfully! ID:', result.insertId, '\n');
					callback();
				});
			});
	});
}

// View All Employees
function viewEmployees(callback) {
    const sql = `SELECT * FROM employees`;

    db.query(sql, (err, results) => {
        if (err) {
            console.log('\n Error fetching employees:', err.message);
            setTimeout(callback, 500);
            return;
        }

        if (!results || results.length === 0) {
          console.log('\n No employees found.\n');
          setTimeout(callback, 500);
          return;
        }

        console.log('\n--- EMPLOYEES ---');
        console.table(results);
        console.log('');
        setTimeout(callback, 500);
    });
}

// Update an Employee's Role
function updateEmployeeRole(callback) {
	let employeeOptions = [];
	const employeeSql = `SELECT id, first_name, last_name FROM employees`;

	db.query(employeeSql, (err, employeeResults) => {
		if (err) {
			console.log('\n Error fetching employees:', err.message);
			callback();
			return;
		}

		if (!employeeResults || employeeResults.length === 0) {
			console.log('\n No employees found. Please add an employee first.\n');
			callback();
			return;
		}

		employeeOptions = employeeResults.map((emp) => ({
			name: `${emp.first_name} ${emp.last_name} (ID: ${emp.id})`,
			value: emp.id
		}));

		let roleOptions = [];
		const roleSql = `SELECT id, title FROM roles`;

		db.query(roleSql, (err, roleResults) => {
			if (err) {
				console.log('\n Error fetching roles:', err.message);
				callback();
				return;
			}

			if (!roleResults || roleResults.length === 0) {
				console.log('\n  No roles found. Please add a role first.\n');
				callback();
				return;
			}

			roleOptions = roleResults.map((role) => ({ name: role.title, value: role.id }));

			const inquirer = require('inquirer');
			const questions = [
				['list', 'selectEmployee', 'Which employee do you want to update?', employeeOptions],
				['list', 'selectNewRole', 'What is the new role?', roleOptions],
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
					const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
					const values = [usersResponse.selectNewRole, usersResponse.selectEmployee];

					db.query(sql, values, (err, result) => {
						if (err) {
							console.log('\n❌ Error updating employee role:', err.message);
							callback();
							return;
						}
						if (result.affectedRows === 0) {
							console.log('\n  Employee not found.\n');
							callback();
							return;
						}
						console.log('\n Employee role updated successfully!\n');
						callback();
					});
				});
		});
	});
}

module.exports = { viewEmployees, addEmployee, updateEmployeeRole };