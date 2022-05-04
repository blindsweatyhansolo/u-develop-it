const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// GET return all data from candidates table, join with party affiliation
router.get('/candidates', (req, res) => {
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

// GET return single record from candidates table, join with party affiliation
router.get('/candidate/:id', (req, res) => {
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

// CREATE a candidate
router.post('/candidate', ({ body }, res) => {
    // Candidate is allowed not to be affiliated with a party
    const errors = inputCheck(
        body, 
        'first_name', 
        'last_name', 
        'industry_connected'
    );
    
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
                VALUES (?,?,?)`;
    const params = [
        body.first_name, 
        body.last_name, 
        body.industry_connected
    ];
    
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: `Success`,
            data: body,
            changes: result.affectedRows
        });
    });
});

// UPDATE candidate's party
router.put('/candidate/:id', (req, res) => {
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
            // check if a record was found
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

// DELETE a candidate
router.delete('/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.resultMessage(400).json({ error: res.message });
        } else if (!result.affectedRows) {
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

module.exports = router;