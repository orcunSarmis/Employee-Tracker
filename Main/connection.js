const mysql2 = require('mysql2');

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

module.exports = db;