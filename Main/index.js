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
        console.log("\n");

    const query = `SELECT DISTINCT employee.id, employee.first_name, 
    employee.last_name, role.title, department.name AS 'department', 
    role.salary, CONCAT(manager.first_name, ' ', manager.last_name) 
    AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id 
    LEFT JOIN employee manager ON manager.id = employee.manager_id`;
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        console.log("\n");

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
    console.log("\n");

    const query = `SELECT employee.id, employee.first_name, 
    employee.last_name, department.name AS 'department'FROM employee 
    LEFT JOIN role on employee.role_id = role.id 
    LEFT JOIN department department on 
    role.department_id = department.id WHERE department.id`;
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        console.log("\n");

        mainMenu();
    });
};
    // mainMenu();

// View All Employees By Manager Function
const viewAllEmployeesByManager = () => {
    const managers = db.viewAllEmployees();
    console.log("\n");

    const managerChoices = managers.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));

    const { managerId } = inquirer.prompt([
        {
        type: "list",
        name: "managerId",
        message: "Which employee do you want to see direct reports for?",
        choices: managerChoices
        }
    ]);
    // let managerId = 1;
    const query = `SELECT employee.id, employee.first_name, 
    employee.last_name, department.name AS department, 
    role.title FROM employee LEFT JOIN role on role.id = 
    employee.role_id LEFT JOIN department ON department.id = 
    role.department_id WHERE manager_id = ?`;
    db.query(query, managerId, (err, res) => {
        if (err) throw err;
        console.table(res);
        console.log("\n");

        mainMenu();
    });
};

// Add Employee Function
const addEmployee = () => {
    console.log("\n");

    const employee = inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "What is the employee's first name?"
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the employee's last name?"
        }
    ]);

    const roleChoices = roles.map(({ id, title }) => ({
            name: title,
            value: id
    }));

    const { roleId } = inquirer.prompt({
        type: "list",
        name: "roleId",
        message: "What is the employee's role?",
        choices: roleChoices
    });

    employee.role_id = roleId;

    const managerChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `$(first_name) $(last_name)`,
        value: id
    }));
    managerChoices.unshift({ name: "None, value: null "});

    const { managerId } = inquirer.prompt({
        type: "input",
        name: "managerId",
        message: "Who is the employee's manager?",
        choices: managerChoices
      });
    
      employee.manager_id = managerId;

      db.createEmployee(employee);

      console.log(
        `Added ${employee.first_name} ${employee.last_name} to the database`
      );

      mainMenu();

// Remove Employee Function
const removeEmployee = () => {
    console.log("\n");

    const employees = db.viewAllEmployees();

    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));

    const { employeeId } = inquirer.prompt([
    {
        type: "list",
        name: "employeeId",
        message: "Which employee do you want to remove?",
        choices: employeeChoices
    }
    ]); 

     db.removeEmployee(employeeId);

    console.log("Removed employee from the database");

    mainMenu();

}};

// Update Employee Role Function
async function updateEmployeeRole() {
    const employees = db.viewAllEmployees();
  
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id
    }));
  
    const { employeeId } =inquirer.prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee's role do you want to update?",
        choices: employeeChoices
      }
    ]);
  
    const roles = db.findAllRoles();
  
    const roleChoices = roles.map(({ id, title }) => ({
      name: title,
      value: id
    }));
  
    const { roleId } = inquirer.prompt([
      {
        type: "list",
        name: "roleId",
        message: "Which role do you want to assign the selected employee?",
        choices: roleChoices
      }
    ]);
  
    db.updateEmployeeRole(employeeId, roleId);
  
    console.log("Updated employee's role");


}

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
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // inquirer
    // .prompt({
    //     name: `employee`,
    //     type: `input`,
    //     message: `All Employee`,
    // }).then((answer) => {