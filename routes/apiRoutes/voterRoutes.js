const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// GET returns all records from voters table
router.get('/voters', (req, res) => {
    // sort order by last name
    const sql = `SELECT * FROM voters ORDER BY last_name`;

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

// GET returns single record from voter table
router.get('/voter/:id', (req, res) => {
    const sql = `SELECT * FROM voters WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.json(400).json({ error: err.message });
            return;
        }
        res.json({
            message: `Success`,
            data: row
        });
    });
});

module.exports = router;