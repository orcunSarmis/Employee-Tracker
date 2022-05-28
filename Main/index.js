// Setting dependencies
//  Import and require mysql2
const mysql2 = require('mysql2');
const inquire = require('inquire');
// Import and require console.table
const consoleTable = require('console.table');
const db = require('../Main/connection');



// connection.connect((err) => {
//     if (err) throw err;
//     mainMenu();
// });

const mainMenu = () => {
    inquirer.propmt([
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
        }.then((answer) => {
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
                    emoveEmployee();
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
    ]);
};










app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});