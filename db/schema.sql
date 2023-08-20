DROP DATABASE IF  EXISTS emp_trk;
-- Creates the "emp_trk" database --
CREATE DATABASE emp_trk;

-- Makes it so all of the following code will affect emp_trk--
USE emp_trk;

-- Creates the table "departments" within emp_trk --
CREATE TABLE departments (
  -- Creates a numeric column called "id" which will automatically increment its default value as we create new rows --
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  dept VARCHAR(30) NOT NULL
);

-- Creates the table "role" within emp_trk --
CREATE TABLE roles (
  -- Creates a numeric column called "id" which will automatically increment its default value as we create new rows --
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  -- Makes a string column called "title" which cannot contain null --
  title VARCHAR(30) NOT NULL,
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- Creates the table "employee" within emp_trk --
CREATE TABLE employees (
  -- Creates a numeric column called "id" which will automatically increment its default value as we create new rows --
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  -- Makes a string column called "first_name" & "last_name" which cannot contain null --
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL, 
  manager_id INT,
  FOREIGN KEY (manager_id) REFERENCES employees(id)
);