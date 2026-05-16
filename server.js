const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

// 1. MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// 2. DATABASE: Connect to SQLite file cleanly
const db = new sqlite3.Database('./educonnect.db');

// 3. TABLE STRUCTURE: Dynamic schema for handling all user roles
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT,
        institution TEXT,
        details TEXT
    )`);
});

// 4. ROUTE: Serve registration view layout
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'register-page', 'register.html'));
});

// 5. ROUTE: Handle registration submissions dynamically for all roles
app.post('/api/register', (req, res) => {
    // Destructure every possible field sent by your register.js payload
    const { fn, ln, em, pw, role, sch, gr, sid, tid, hid, sub, dis, ph, dep } = req.body;
    const fullName = `${fn || ''} ${ln || ''}`.trim();

    if (!role) {
        return res.status(400).json({ success: false, message: "Role selection missing." });
    }

    // Check if user email exists
    db.get("SELECT id FROM users WHERE email = ?", [em], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: "Database lookup error." });
        if (row) {
            return res.status(400).json({ success: false, message: "This email is already registered!" });
        }

        // Determine Institution Name based on role layout
        let userInstitution = sch || 'N/A';
        if (role === 'nesa') userInstitution = 'REB / NESA Ministry Office';

        // Structure user profile specifications based on role types
        let userDetails = '';
        if (role === 'student') {
            userDetails = `Grade: ${gr || 'N/A'} | Student ID: ${sid || 'N/A'}`;
        } else if (role === 'teacher') {
            userDetails = `Teacher ID: ${tid || 'N/A'} | Subjects: ${sub || 'N/A'}`;
        } else if (role === 'headteacher') {
            userDetails = `Headteacher ID: ${hid || 'N/A'} | District: ${dis || 'N/A'} | Phone: ${ph || 'N/A'}`;
        } else if (role === 'nesa') {
            userDetails = `Official ID: ${sid || 'N/A'} | Dept: ${dep || 'N/A'} | Phone: ${ph || 'N/A'}`;
        }

        const query = `INSERT INTO users (name, email, password, role, institution, details) VALUES (?, ?, ?, ?, ?, ?)`;
        
        db.run(query, [fullName, em, pw, role, userInstitution, userDetails], function(insertErr) {
            if (insertErr) {
                return res.status(500).json({ success: false, message: "Failed to write data records to database." });
            }
            return res.json({ success: true });
        });
    });
});

// 6. ROUTE: Unified Visual Directory Dashboard
app.get('/admin/users', (req, res) => {
    db.all("SELECT id, name, email, role, institution, details FROM users ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.status(500).send("Error reading database records.");

        let tableRows = rows.map(user => {
            let badge = '';
            if (user.role === 'student') badge = '<span style="background:#e3f2fd; color:#0d47a1; padding:4px 8px; border-radius:4px; font-weight:bold; font-size:11px; text-transform:uppercase;">Student</span>';
            if (user.role === 'teacher') badge = '<span style="background:#e8f5e9; color:#1b5e20; padding:4px 8px; border-radius:4px; font-weight:bold; font-size:11px; text-transform:uppercase;">Teacher</span>';
            if (user.role === 'headteacher') badge = '<span style="background:#fff3e0; color:#e65100; padding:4px 8px; border-radius:4px; font-weight:bold; font-size:11px; text-transform:uppercase;">Headteacher</span>';
            if (user.role === 'nesa') badge = '<span style="background:#ede9fe; color:#7c3aed; padding:4px 8px; border-radius:4px; font-weight:bold; font-size:11px; text-transform:uppercase;">NESA Official</span>';

            return `
                <tr>
                    <td>${user.id}</td>
                    <td><strong>${user.name}</strong></td>
                    <td>${user.email}</td>
                    <td>${badge}</td>
                    <td>${user.institution}</td>
                    <td style="font-size: 13px; color: #555;">${user.details}</td>
                </tr>
            `;
        }).join('');

        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>EduConnect Directory</title>
                <style>
                    body { font-family: sans-serif; background: #f3f6fd; padding: 40px; color: #0f2c59; }
                    table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;}
                    th, td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; }
                    th { background: #0f2c59; color: white; }
                    h2 { margin-bottom: 20px; }
                </style>
            </head>
            <body>
                <h2>📋 Rwanda EduConnect Active Directory (${rows.length} Total Registered Users)</h2>
                <table>
                    <thead>
                        <tr><th>ID</th><th>Full Name</th><th>Email Address</th><th>Role Type</th><th>School / Organization</th><th>Profile Specifications</th></tr>
                    </thead>
                    <tbody>
                        ${tableRows.length > 0 ? tableRows : '<tr><td colspan="6" style="text-align:center;">No registration files found inside SQLite yet.</td></tr>'}
                    </tbody>
                </table>
            </body>
            </html>
        `);
    });
});

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));