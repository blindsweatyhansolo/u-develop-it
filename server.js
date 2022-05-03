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

// handle unsupported user requests (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
