const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username
        user: 'root',
        // MySQL password
        password: 'Orc789&Q',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);
//     connection.connect((err) => {
//     if (err) throw error;
//     console.log(`Connected to the employees_db database.`);

//     console.log(chalk.yellow.bold(`====================================================================================`));
//     console.log(``);
//     console.log(chalk.greenBright.bold(figlet.textSync('Employee Tracker')));
//     console.log(``);
//     console.log(`                                                          ` + chalk.greenBright.bold('Created By: Orcun Sarmis'));
//     console.log(``);
//     console.log(chalk.yellow.bold(`====================================================================================`));
//     mainMenu();
// }));



module.exports = db;