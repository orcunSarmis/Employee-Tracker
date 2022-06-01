const mysql = require('mysql2');
// import chalk from 'chalk';
// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username
        user: 'root',
        // MySQL password
        password: process.env.PASSWORD,
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);

// const sequelize = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//     {
//       host: 'localhost',
//       dialect: 'mysql',
//       port: 3306,
//     }
//   );
//     connection.connect((err) => {
//     if (err) throw error;
//     console.log(`Connected to the employees_db database.`);

    // console.log(chalk.yellow.bold(`====================================================================================`));
//     console.log(``);
//     console.log(chalk.greenBright.bold(figlet.textSync('Employee Tracker')));
//     console.log(``);
//     console.log(`                                                          ` + chalk.greenBright.bold('Created By: Orcun Sarmis'));
//     console.log(``);
//     console.log(chalk.yellow.bold(`====================================================================================`));
//     mainMenu();
// }));



module.exports = db;