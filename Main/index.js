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
        }
    ]);
};










app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});