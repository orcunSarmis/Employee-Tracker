// Setting dependencies
const express = require('express');
//  Import and require mysql2
const mysql2 = require('mysql2');
const inquire = require('inquire');
// Import and require console.table
const cTable = require('console.table');
const Connection = require('mysql2/typings/mysql/lib/Connection');

const PORT = process.env.PORT || 3001;
const app = express();

// Express iddleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username
        user: 'root',
        // MySQL password
        password: 'Orc789&Q',
        database: ''
    },
    console.log(`Connected to the database.`)
);

Connection.connect((err) => {
    if (err) throw err;
    ();
});

const = () => {
    inquirer.propmt([
        {
            name: '',
            type: '',
            message: '',

        }
    ])
}

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});