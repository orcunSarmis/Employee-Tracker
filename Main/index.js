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
    
    console.log("\n");

    const query = `SELECT employee.id, employee.first_name, 
    employee.last_name, department.name AS department, 
    role.title FROM employee LEFT JOIN role on role.id = 
    employee.role_id LEFT JOIN department ON department.id = 
    role.department_id WHERE manager_id`;
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        console.log("\n");

        // const managers = viewAllEmployees();
    // const managerChoices = managers.map(({ id, first_name, last_name }) => ({
    //     name: `${first_name} ${last_name}`,
    //     value: id
    //   }));

    // const { managerId } = inquirer.prompt([
    //     {
    //     type: "list",
    //     name: "managerId",
    //     message: "Which employee do you want to see direct reports for?",
    //     choices: managerChoices
    //     }
    // ]);
    // // let managerId = 1;
    // const query = `SELECT employee.id, employee.first_name, 
    // employee.last_name, department.name AS department, 
    // role.title FROM employee LEFT JOIN role on role.id = 
    // employee.role_id LEFT JOIN department ON department.id = 
    // role.department_id WHERE manager_id = ?`;
    // db.query(query, managerId, (err, res) => {
    //     if (err) throw err;
    //     console.table(res);
    //     console.log("\n");

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

          db.query(sql, (error, employeeResponse ) => {
            if (error) throw error;
            let employeeNamesArray = [];
            employeeResponse .forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});

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

              employeeResponse.forEach((employee) => {
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
}

  // Update Employee Manager Function
  const updateEmployeeManager = () => {
    console.log("\n");

    let sql =  `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id
    FROM employee`;
      db.query(sql, (error, response) => {
      let employeeNamesArray = [];
      response.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});

              inquirer
              .prompt([
              {
              name: 'chosenEmployee',
              type: 'list',
              message: 'Which employee has a new manager?',
              choices: employeeNamesArray
              },
              {
              name: 'newManager',
              type: 'list',
              message: 'Who is their manager?',
              choices: employeeNamesArray
              }
              ])
                  .then((answer) => {
                  let employeeId, managerId;
                  response.forEach((employee) => {
                  if (
                  answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`
                  ) {
                  employeeId = employee.id;
                  }

                if (
                answer.newManager === `${employee.first_name} ${employee.last_name}`
                ) {
                managerId = employee.id;
                }
            });

            if (isSame(answer.chosenEmployee, answer.newManager)) {
              console.log(`Invalid Manager Selection`);
            // console.log(chalk.redBright.bold(`====================================================================================`));
            // console.log(chalk.redBright(`Invalid Manager Selection`));
            // console.log(chalk.redBright.bold(`====================================================================================`));
            mainMenu();
            } else {
            let sql = `UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?`;

            db.query(
            sql,
            [managerId, employeeId],
            (error) => {
            if (error) throw error;
            console.log(`Employee Manager Updated`);
            // console.log(chalk.greenBright.bold(`====================================================================================`));
            // console.log(chalk.greenBright(`Employee Manager Updated`));
            // console.log(chalk.greenBright.bold(`====================================================================================`));
            mainMenu();
            }
        );
      }
    });
  }); 
};
  
// View All Roles Function
const viewAllRoles = () => {
  console.log("\n");

          // console.log(chalk.yellow.bold(`====================================================================================`));
          // console.log(`                              ` + chalk.green.bold(`Current Employee Roles:`));
          // console.log(chalk.yellow.bold(`====================================================================================`));
          console.log(`Current Employee Roles:`);
          const sql =     `SELECT role.id, role.title, department.name AS department
                          FROM role
                          INNER JOIN department ON role.department_id = department.id`;
          db.query(sql, (error, response) => {
            if (error) throw error;
              response.forEach((role) => {console.log(role.title);});
              // console.log(chalk.yellow.bold(`====================================================================================`));
              mainMenu();
          });
};

// Add a New Role Function
const addRole = () => {
  console.log("\n");

  const sql = 'SELECT * FROM department'
  db.query(sql, (error, response) => {
      if (error) throw error;
      let deptNamesArray  = [];
      response.forEach((department) => {deptNamesArray.push(department.name);});
      deptNamesArray.push('Create Department');
      inquirer
        .prompt([
          {
            name: 'departmentName',
            type: 'list',
            message: 'Which department is this new role in?',
            choices: deptNamesArray
          }
        ])
        .then((answer) => {
          if (answer.departmentName  === 'Create Department') {
            addDepartment();
          } else {
            addRoleResume(answer);
          }
        });

      const addRoleResume = (departmentData) => {
        inquirer
          .prompt([
            {
              name: 'newRole',
              type: 'input',
              message: 'What is the name of your new role?',
            },
            {
              name: 'salary',
              type: 'input',
              message: 'What is the salary of this new role?',
            }
          ])
          .then((answer) => {
            let createdRole = answer.newRole;
            let departmentId;

            response.forEach((department) => {
              if (departmentData.departmentName  === department.name) {departmentId = department.id;}
            });

            let sql =   `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            let crit = [createdRole, answer.salary, departmentId];

            db.query(sql, crit, (error) => {
              if (error) throw error;
              console.log(`Role successfully created!`);
              // console.log(chalk.yellow.bold(`====================================================================================`));
              // console.log(chalk.greenBright(`Role successfully created!`));
              // console.log(chalk.yellow.bold(`====================================================================================`));
              viewAllRoles();
            });
          });
      };
    });
};


// Remove a Role Function
const removeRole = () => {
  console.log("\n");

  let sql = `SELECT role.id, role.title FROM role`;

    db.query(sql, (error, response) => {
      if (error) throw error;
      let roleNamesArray = [];
      response.forEach((role) => {roleNamesArray.push(role.title);});

      inquirer
        .prompt([
          {
            name: 'chosenRole',
            type: 'list',
            message: 'Which role would you like to remove?',
            choices: roleNamesArray
          }
        ])
        .then((answer) => {
          let roleId;

          response.forEach((role) => {
            if (answer.chosenRole === role.title) {
              roleId = role.id;
            }
          });

          let sql =   `DELETE FROM role WHERE role.id = ?`;
          db.query(sql, [roleId], (error) => {
            if (error) throw error;
            console.log(`Role Successfully Removed`);
            // console.log(chalk.redBright.bold(`====================================================================================`));
            // console.log(chalk.greenBright(`Role Successfully Removed`));
            // console.log(chalk.redBright.bold(`====================================================================================`));
            viewAllRoles();
          });
        });
    });
  };

// View all Departments Function
const viewAllDepartments = () => {
  const sql =   `SELECT department.id AS id, department.name AS department FROM department`; 
  db.query(sql, (error, response) => {
    if (error) throw error;
    console.table(response);
    // console.log(chalk.yellow.bold(`====================================================================================`));
    // console.log(`                              ` + chalk.green.bold(`All Departments:`));
    // console.log(chalk.yellow.bold(`====================================================================================`));
    // console.table(response);
    // console.log(chalk.yellow.bold(`====================================================================================`));
    mainMenu();
  });
};

// Add a New Department
const addDepartment = () => {
  console.log("\n");

  inquirer
    .prompt([
      {
        name: 'newDepartment',
        type: 'input',
        message: 'What is the name of your new Department?',
        // validate: validate.validateString
      }
    ])
    .then((answer) => {
      let sql =     `INSERT INTO department (name) VALUES (?)`;
      db.query(sql, answer.newDepartment, (error, response) => {
        if (error) throw error;
        console.log(answer.newDepartment + `Department successfully created!`)

        // console.log(``);
        // console.log(chalk.greenBright(answer.newDepartment + ` Department successfully created!`));
        // console.log(``);
        viewAllDepartments();
      });
    });
};


// Remove a Department Function
const removeDepartment = () => {
  console.log("\n");

    let sql =   `SELECT department.id, department.name FROM department`;
    db.query(sql, (error, response) => {
      if (error) throw error;
      let departmentNamesArray = [];
      response.forEach((department) => {departmentNamesArray.push(department.name);});

      inquirer
        .prompt([
          {
            name: 'chosenDept',
            type: 'list',
            message: 'Which department would you like to remove?',
            choices: departmentNamesArray
          }
        ])
        .then((answer) => {
          let departmentId;

          response.forEach((department) => {
            if (answer.chosenDept === department.name) {
              departmentId = department.id;
            }
          });

          let sql =     `DELETE FROM department WHERE department.id = ?`;
          db.query(sql, [departmentId], (error) => {
            if (error) throw error;
            console.log(`Department Successfully Removed`);
            // console.log(chalk.redBright.bold(`====================================================================================`));
            // console.log(chalk.redBright(`Department Successfully Removed`));
            // console.log(chalk.redBright.bold(`====================================================================================`));
            viewAllDepartments();
          });
        });
    });
}; 

// View The Total Utilized Budget By Department Function
const viewTotalBudget = () => {
  console.log("\n");

  // console.log(chalk.yellow.bold(`====================================================================================`));
  // console.log(`                              ` + chalk.green.bold(`Budget By Department:`));
  // console.log(chalk.yellow.bold(`====================================================================================`));
  const sql =     `SELECT department_id AS id, 
                  department.name AS department,
                  SUM(salary) AS budget
                  FROM  role  
                  INNER JOIN department ON role.department_id = department.id GROUP BY  role.department_id`;
  db.query(sql, (error, response) => {
    if (error) throw error;
      console.table(response);
      // console.log(chalk.yellow.bold(`====================================================================================`));
      mainMenu();
  });
};

mainMenu();


