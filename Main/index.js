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
  console.log("\n");
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

    inquirer.prompt([
        {
          type: 'input',
          name: 'fistName',
          message: "What is the employee's first name?",
        },
        {
          type: 'input',
          name: 'lastName',
          message: "What is the employee's last name?",
        }
      ])
        .then(answer => {
        const crit = [answer.fistName, answer.lastName]
        const roleSql = `SELECT role.id, role.title FROM role`;
        db.query(roleSql, (error, data) => {
          if (error) throw error; 
          const role = data.map(({ id, title }) => ({ name: title, value: id }));
          inquirer.prompt([
                {
                  type: 'list',
                  name: 'role',
                  message: "What is the employee's role?",
                  choices: role
                }
              ])
                .then(roleChoice => {
                  const role = roleChoice.role;
                  crit.push(role);
                  const managerSql =  `SELECT * FROM employee`;
                  db.query(managerSql, (error, data) => {
                    if (error) throw error;
                    const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
                    inquirer.prompt([
                      {
                        type: 'list',
                        name: 'manager',
                        message: "Who is the employee's manager?",
                        choices: managers
                      }
                    ])
                      .then(managerChoice => {
                        const manager = managerChoice.manager;
                        crit.push(manager);
                        const sql =   `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                      VALUES (?, ?, ?, ?)`;
                        db.query(sql, crit, (error) => {
                        if (error) throw error;
                        console.log("\n");
                        
                        console.log("Employee has been added!")
                        viewAllEmployees();
                  });
                });
              });
            });
         });
      }); 

    //   mainMenu();
};
// Remove Employee Function
const removeEmployee = () => {
    console.log("\n");

    let sql =     `SELECT employee.id, employee.first_name, employee.last_name FROM employee`;

    db.query(sql, (error, response) => {
      if (error) throw error;
      let employeeNamesArray = [];
      response.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});

      inquirer
        .prompt([
          {
            name: 'chosenEmployee',
            type: 'list',
            message: 'Which employee would you like to remove?',
            choices: employeeNamesArray
          }
        ])
        .then((answer) => {
          let employeeId;

          response.forEach((employee) => {
            if (
              answer.chosenEmployee ===
              `${employee.first_name} ${employee.last_name}`
            ) {
              employeeId = employee.id;
            }
          });

          let sql = `DELETE FROM employee WHERE employee.id = ?`;
          db.query(sql, [employeeId], (error) => {
            if (error) throw error;
            console.log("Employee Successfully Removed");
            // console.log(chalk.redBright.bold(`====================================================================================`));
            // console.log(chalk.redBright(`Employee Successfully Removed`));
            // console.log(chalk.RedBright.bold(`====================================================================================`));
            viewAllEmployees();
          });
        });
    });

    mainMenu();

};

// Update Employee's Role Function
const updateEmployeeRole = () => {
  console.log("\n");
   
          let sql =       `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id"
          FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;

          db.query(sql, (error, response) => {
            if (error) throw error;
            let employeeNamesArray = [];
            response.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});

          let sql =     `SELECT role.id, role.title FROM role`;
              db.query(sql, (error, response) => {
              if (error) throw error;
              let rolesArray = [];
              response.forEach((role) => {rolesArray.push(role.title);});

      inquirer
        .prompt([
        {
        name: 'chosenEmployee',
        type: 'list',
        message: 'Which employee has a new role?',
        choices: employeeNamesArray
        },
        {
        name: 'chosenRole',
        type: 'list',
        message: 'What is their new role?',
        choices: rolesArray
        }
        ])
        .then((answer) => {
        let newTitleId, employeeId;

        response.forEach((role) => {
            if (answer.chosenRole === role.title) {
            newTitleId = role.id;
            }
        });

        response.forEach((employee) => {
            if (
            answer.chosenEmployee ===
            `${employee.first_name} ${employee.last_name}`
            ) {
            employeeId = employee.id;
            }
        });

        let sqls =  `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
        db.query(
        sqls,
        [newTitleId, employeeId],
        (error) => {
        if (error) throw error;
        console.log(`Employee Role Updated`);
        mainMenu();
        // console.log(chalk.greenBright.bold(`====================================================================================`));
        // console.log(chalk.greenBright(`Employee Role Updated`));
        // console.log(chalk.greenBright.bold(`====================================================================================`));
        
        }
        );
      });
    });
  });

  // Update Employee Manager Function
  const updateEmployeeManager = () => {
    console.log("\n");

    
  }
  
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

    // findAllRoles() {
//     return this.connection.query(
//       "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
//     );
//   }



// / >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // let newEmployee = [];
    // db.query(`SELECT * FROM employee`, (err, data) => {
    //     if (err) throw err;
    //     console.log(data);
    //     let newEmployee = data.map(n => ({
    //         name: n.name,
    //         value: n.id,
    //     }))

    // inquirer
    // .prompt([
    // {
    //     name: `first_name`,
    //     type: `input`,
    //     message: `What is the first name of the new employee?`
    // },

    // {
    //     name: `last_name`,
    //     type: `input`,
    //     message: `What is the last name of the new employee?`
    // },

    // {
    //     name: `role_id`,
    //     type: `input`,
    //     message: `What role is the new employee in?`,
    // },

    // {
    //     name: `manager_id`,
    //     type: `input`,
    //     message: `What is the new manager ID of the new employee?`,
    // }])
    // .then(answer => {
    //     const query = `INSERT INTO role (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
    //     db.query(query, [answer.first_name, answer.last_name, answer.role_id, answer.manager_id], (err, res) => {
    //         if (err) throw err;
    //         console.log(answer.first_name, answer.last_name, answer.role_id, answer.manager_id);
            
    //     }) 

    //     });
    // }); 
