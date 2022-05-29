// Setting dependencies
//  Import and require mysql2
const mysql = require('mysql2');
const inquirer = require('inquirer');
// import chalk from 'chalk';
const figlet = require('figlet');
// const chalk = require('chalk');
// Import and require console.table
const consoleTable = require('console.table');
const db = require('../Main/connection');





const mainMenu = () => {
    inquirer.prompt(
        {
            name: 'choices',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'View All Employees By Department',
                'View All Employees By Manager',
                'Add Employee',
                'Remove Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'View All Roles',
                'Add Role',
                'Remove Role',
                'View All Departments',
                'Add Department',
                'Remove Department',
                'View The Total Utilized Budget By Department',
                'Quiet'
            ]
        }).then((answer) => {
            switch(answer.choices) {
                case `View All Employees`:
                    viewAllEmployees();
                    break;
                case `View All Employees By Department`:
                    viewAllEmployeesByDepartment();
                    break;
                case `View All Employees By Manager`:
                    viewAllEmployeesByManager();
                    break;
                case `Add Employee`:
                    addEmployee();
                    break;
                case `Remove Employee`:
                    removeEmployee();
                    break;
                case `Update Employee Role`:
                    updateEmployeeRole();
                    break;
                case `Update Employee Manager`:
                    updateEmployeeManager();
                    break;
                case `View All Roles`:
                    viewAllRoles();
                    break;
                case `Add Role`:
                    addRole();
                    break;
                case `Remove Role`:
                    removeRole();
                    break;
                case `View All Departments`:
                    viewAllDepartments();
                    break;
                case `Add Department`:
                    addDepartment();
                    break;
                case `Remove Department`:
                    removeDepartment();
                    break;
                case `View The Total Utilized Budget By Department`:
                    viewTotalBudget();
                    break;
                case `Quit`:
                    quit();
                    break;
            }
        })
    // ]);
};

// View All Employees Function
const viewAllEmployees = () => {
    // inquirer
    // .prompt({
    //     name: `employee`,
    //     type: `input`,
    //     message: `All Employee`,
    // }).then((answer) => {
    const query = `SELECT DISTINCT employee.id, employee.first_name, 
    employee.last_name, role.title, department.name AS 'department', 
    role.salary, CONCAT(manager.first_name, ' ', manager.last_name) 
    AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id 
    LEFT JOIN employee manager ON manager.id = employee.manager_id`;
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        mainMenu();
        // console.log(chalk.yellow.bold(`====================================================================================`));
        // console.log(`                              ` + chalk.green.bold(`Current Employees:`));
        // console.log(chalk.yellow.bold(`====================================================================================`));
        // console.table(res);
        // console.log(chalk.yellow.bold(`====================================================================================`));
    });
    // mainMenu();
    // });
};

// View All Employees By Department Function
const viewAllEmployeesByDepartment = () => {
    const query = `SELECT employee.id, employee.first_name, 
    employee.last_name, department.name AS 'department'FROM employee 
    LEFT JOIN role on employee.role_id = role.id 
    LEFT JOIN department department on 
    role.department_id = department.id WHERE department.id `;
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
};
    // mainMenu();

// View All Employees By Manager Function
const viewAllEmployeesByManager = () => {
    const query = `SELECT employee.id, employee.first_name, 
    employee.last_name, department.name AS department, 
    role.title FROM employee LEFT JOIN role on role.id = 
    employee.role_id LEFT JOIN department ON department.id = 
    role.department_id WHERE manager_id`;
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
};


mainMenu();

// _____________________________________________________________________________________
// try for View All Employees By Department
// SELECT department.id, department.name, SUM (role.salary) AS utilized_budget FROM employee LEFT JOIN 
//     role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name


// View All Employees By Department Same but not works well
// SELECT 
//     employee.first_name AS First, 
//     employee.last_name AS Last, 
//     role.title AS Title, 
//     role.salary AS Salary, 
//     department.name AS Department, 
//     CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee 
//     INNER JOIN role on role.id = employee.role_id 
//     INNER JOIN department 
//     on department.id = role.department_id 
//     LEFT JOIN employee e 
//     on employee.manager_id = e.id
//     ORDER BY Department