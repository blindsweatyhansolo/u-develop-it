const express = require('express');
// import mysql2 package
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// connect app to MySQL database
const db = mysql.createConnection(
    {
        host: 'localHost',
        // your MySQL username
        user: 'root',
        // your MySQL password
        password: '12parsecKe$$elruN',
        database: 'election'
    },
    console.log('Connected to the election database.')
);

// return all data from candidates table
// query() method runs the SQL query and executes the callback with all the resulting rows that match
// db.query(`SELECT * FROM candidates`, (err, rows) => {
//     // responses captured as err (no errors returns 'null') and rows (db query response)
//     console.log(rows);
// });

// // return single record from candidates table
// db.query(`SELECT * FROM candidates WHERE id = 10`, (err, row) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(row);
// });

// // DELETE a candidate from table
// // ? denotes a placeholder, making this a prepared statement
// // additional (param) argument following statement provides values to use in place of the placeholders
// // (param) argument can be an array that holds multiple values for the multiple placeholders
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });

// CREATE a candidate
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) 
// VALUES (?,?,?,?)`;
// const params = [1, 'Ronald', 'Firbank', 1];

// db.query(sql, params, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });

// (catchall route) handle unsupported user requests (404 Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
