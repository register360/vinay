const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Database connection configuration
const pool = new Pool({
    user: 'weburnstech',
    host: 'dpg-d0i3q8juibrs739tvta0-a.oregon-postgres.render.com',
    database: 'my_database_hrx6',
    password: 'nxQsm9AYoiRe3CtDd6IUqWmjGLTmUtXc',
    port: 5432,
    ssl: {
        rejectUnauthorized: false // Required for Render PostgreSQL
    }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve your HTML, CSS, JS files

// Create table if not exists
async function createTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS registrations (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                gender VARCHAR(10) NOT NULL,
                dob DATE NOT NULL,
                address TEXT NOT NULL,
                phone VARCHAR(20) NOT NULL,
                email VARCHAR(100) NOT NULL,
                current_class VARCHAR(50) NOT NULL,
                course VARCHAR(50) NOT NULL,
                registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Table created or already exists');
    } catch (err) {
        console.error('Error creating table:', err);
    }
}

createTable();

// Registration endpoint
app.post('/register', async (req, res) => {
    try {
        const { name, gender, dob, address, phone, email, current_class, course } = req.body;
        
        const result = await pool.query(
            'INSERT INTO registrations (name, gender, dob, address, phone, email, current_class, course) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [name, gender, dob, address, phone, email, current_class, course]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});