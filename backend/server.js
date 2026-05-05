const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sql = require('mssql');
require('dotenv').config();

const app = express();

// --- MIDDLEWARES ---
app.use(cors()); 
app.use(express.json()); 

// --- UPDATED SQL AUTH CONFIG (The Fix) ---
const dbConfig = {
    server: '127.0.0.1', // Using IP to avoid IPv6/Hostname issues
    user: 'BokaoDev',    // The dedicated user you created in SSMS
    password: 'Motshelo@2026', 
    database: 'MotsheloDB',
    options: {
        port: 1433,
        encrypt: true, 
        trustServerCertificate: true, // Necessary for local development
        connectTimeout: 30000 
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// --- DATABASE CONNECTION POOL ---
let pool;

async function connectDB() {
    try {
        pool = await sql.connect(dbConfig);
        console.log("✅ Connected to Re-Mmogo SQL Database (MotsheloDB)");
    } catch (err) {
        console.error("❌ Database connection failed:", err.message);
    }
}
connectDB();

// --- AUTH MIDDLEWARE ---
const protect = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next(); 
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

// --- ROUTES ---

// 1. REGISTER
app.post('/api/register', async (req, res) => {
    try {
        const { full_name, email, password, phone, national_id } = req.body;
        
        if (!pool) pool = await sql.connect(dbConfig);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await pool.request()
            .input('full_name', sql.NVarChar, full_name)
            .input('email', sql.NVarChar, email)
            .input('password_hash', sql.NVarChar, hashedPassword)
            .input('phone', sql.NVarChar, phone)
            .input('national_id', sql.NVarChar, national_id)
            .query(`INSERT INTO dbo.Members (full_name, email, password_hash, phone, national_id, role) 
                    VALUES (@full_name, @email, @password_hash, @phone, @national_id, 'member')`);

        res.status(201).json({ message: "Member registered in MotsheloDB!" });
    } catch (err) {
        console.error("Registration Error:", err.message);
        res.status(500).json({ message: "Registration failed - check if email already exists" });
    }
});

// 2. LOGIN
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!pool) pool = await sql.connect(dbConfig);

        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT * FROM dbo.Members WHERE email = @email');

        const user = result.recordset[0];

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (isMatch) {
            const token = jwt.sign(
                { id: user.id, role: user.role, name: user.full_name }, 
                process.env.JWT_SECRET, 
                { expiresIn: '1h' }
            );
            res.json({ 
                token, 
                user: { name: user.full_name, role: user.role }, 
                message: "Login successful!" 
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ message: "Server error during login" });
    }
});

// 3. PROTECTED DASHBOARD
app.get('/api/dashboard', protect, (req, res) => {
    res.json({ message: `Access granted! Welcome, ${req.user.name}` });
});

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Gatekeeper Server running on http://localhost:${PORT}`);
});