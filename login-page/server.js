const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

// 1. Tell the server to read JSON data and serve your HTML/CSS files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); 

// 2. Create and connect to your database file (educonnect.db)
const db = new sqlite3.Database('./educonnect.db');

// 3. Create the database table for students when the server starts
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        grade TEXT,
        school TEXT,
        streak INTEGER
    )`);
});

// 4. ROUTE: Serve your registration page when visiting the main link
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// 5. ROUTE: Handle registration data sent from register.js
app.post('/api/register', (req, res) => {
    const { fn, ln, em, pw, gr, sch, role } = req.body;
    const fullName = `${fn} ${ln}`;

    if (role !== 'student') {
        return res.status(400).json({ success: false, message: "Only Student registration is active right now." });
    }

    // Check if the email already exists to avoid duplicate errors
    db.get("SELECT id FROM students WHERE email = ?", [em], (err, row) => {
        if (row) {
            return res.status(400).json({ success: false, message: "This email is already registered!" });
        }

        // Insert the new student row into the database
        const query = `INSERT INTO students (name, email, password, grade, school, streak) VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(query, [fullName, em, pw, gr, sch, 0], function(insertErr) {
            if (insertErr) {
                return res.status(500).json({ success: false, message: "Failed to save to database." });
            }
            return res.json({ success: true });
        });
    });
});

// 6. ROUTE: The Admin page to see everyone who registered!
app.get('/admin/users', (req, res) => {
    db.all("SELECT id, name, email, school, grade, streak FROM students ORDER BY id DESC", [], (err, rows) => {
        if (err) {
            return res.status(500).send("Error reading database.");
        }

        // Build HTML table rows dynamically
        let tableRows = rows.map(user => `
            <tr>
                <td>${user.id}</td>
                <td><strong>${user.name}</strong></td>
                <td>${user.email}</td>
                <td>${user.school}</td>
                <td>${user.grade}</td>
                <td>🔥 ${user.streak} days</td>
            </tr>
        `).join('');

        // Send back a clean dashboard to see our data
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>EduConnect Users</title>
                <style>
                    body { font-family: sans-serif; background: #f3f6fd; padding: 40px; color: #0f2c59; }
                    table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                    th, td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; }
                    th { background: #0f2c59; color: white; }
                </style>
            </head>
            <body>
                <h2>📋 Registered Students Database (${rows.length} Total)</h2>
                <table>
                    <thead>
                        <tr><th>ID</th><th>Name</th><th>Email</th><th>School</th><th>Grade</th><th>Streak</th></tr>
                    </thead>
                    <tbody>
                        ${tableRows.length > 0 ? tableRows : '<tr><td colspan="6" style="text-align:center;">No students registered yet.</td></tr>'}
                    </tbody>
                </table>
            </body>
            </html>
        `);
    });
});

// Start the server on Port 3000
app.listen(3000, () => console.log('Backend running on http://localhost:3000'));