const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // This connects your .env file

const app = express();

// Middlewares
app.use(cors()); // Allows Member 2's React frontend to connect
app.use(express.json()); // Allows the server to read JSON data from forms

// --- TEMPORARY DATA (Until Member 3 finishes the SQL Schema) ---
const members = []; 

// 1. REGISTER ROUTE: Allows a member to join the group
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    members.push({ username, password }); 
    res.status(201).json({ message: "Registration successful!" });
});

// 2. LOGIN ROUTE: The "Gatekeeper" logic[cite: 1]
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = members.find(m => m.username === username && m.password === password);

    if (user) {
        // Create a JWT token for the user[cite: 1]
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, message: "Login successful!" });
    } else {
        res.status(401).json({ message: "Invalid username or password" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Gatekeeper Server running on http://localhost:${PORT}`);
});