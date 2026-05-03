const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors()); // Allows Member 2's frontend to communicate with your API
app.use(express.json()); // Allows your server to parse JSON data from requests

// --- TEMPORARY DATA STORAGE ---
// Note: This will be replaced once Member 3 finishes the SQL Schema
const members = []; 

// --- AUTH MIDDLEWARE (The Gatekeeper) ---
// This function protects routes so only logged-in members can access them[cite: 1]
const protect = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next(); 
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

// --- ROUTES ---

// 1. REGISTER: Securely creates a new member[cite: 1]
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Hash the password before saving (Requirement: Secure Storage)[cite: 1]
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        members.push({ username, password: hashedPassword });
        res.status(201).json({ message: "Member registered securely!" });
    } catch (err) {
        res.status(500).json({ message: "Server error during registration" });
    }
});

// 2. LOGIN: Authenticates a member and issues a JWT token[cite: 1]
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = members.find(m => m.username === username);

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare typed password with the hashed password[cite: 1]
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // Generate the "Key" (Token)[cite: 1]
            const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ 
                token, 
                message: "Login successful!" 
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error during login" });
    }
});

// 3. PROTECTED DASHBOARD: Only accessible with a valid token[cite: 1]
app.get('/api/dashboard', protect, (req, res) => {
    res.json({ message: `Welcome to the Re-Mmogo Dashboard, ${req.user.username}!` });
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Gatekeeper Server running on http://localhost:${PORT}`);
});