const { assertBooleanLiteral } = require('@babel/types');
const express = require('express');
// import mysql2 package
const mysql = require('mysql2');
const inputCheck = require('./utils/inputCheck');

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

// GET return all data from candidates table
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id`;
    
    // query() method runs the SQL query and executes the callback with all the resulting rows that match
    db.query(sql, (err, rows) => {
        if (err) {
            // 500 = server error, return statement to exit call
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Success',
            data: rows
        });
    });
});

// GET return single record from candidates table
app.get('/api/candidate/:id', (req, res) => {
    // ? denotes a placeholder, making this a prepared statement
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id
                WHERE candidates.id = ?`;
    // (params) argument can be an array that holds multiple values for the multiple placeholders
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Success',
            data: row
        });
    });
});

// DELETE a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.resultMessage(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            // if candidate doesn't exist (affectedRows is null/false)
            res.json({
                message: `Candidate not found`
            });
        } else {
            res.json({
                message: `Deleted`,
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

// CREATE a candidate
app.post('/api/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
      VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: `Success`,
            data: body
        });
    });
});

// UPDATE candidate's party
app.put('/api/candidate/:id', (req, res) => {
    const errors = inputCheck(req.body, 'party_id');

    if (errors) {
        res.status(400).json({ error: errors });
        return;
    };

    const sql = `UPDATE candidates SET party_id = ?
                WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        } else if (!result.affectedRows) {
            res.json({
                message: `Candidate not found`
            });
        } else {
            res.json({
                message: `Success`,
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

// GET return all records from parties table
app.get('/api/parties', (req, res) => {
    const sql = `SELECT * FROM parties`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: `Success`,
            data: rows
        });
    });
});

// GET return a single record from parties table
app.get('/api/party/:id', (req, res) => {
    const sql = `SELECT * FROM parties WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: `Success`,
            data: row
        });
    });
});

// DELETE a party
app.delete('/api/party/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: res.message });
            return;
        } else if (!result.affectedRows) {
            res.json({
                message: `Party not found`
            })
        } else {
            res.json({
                message: `Deleted`,
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

// (catchall route) handle unsupported user requests (404 Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
