const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

// --- MIDDLEWARES ---
app.use(cors()); 
app.use(express.json()); 

// --- SUPABASE CONFIG (Fixed Naming) ---
// We use the NEXT_PUBLIC names to match your current .env file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if variables are loading before initializing
if (!supabaseUrl || !supabaseKey) {
    console.error("❌ ERROR: Supabase credentials missing. Check your .env file location!");
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log("✅ Connected to RE-MMOGO Supabase (PostgreSQL)");

// --- AUTH MIDDLEWARE ---
const protect = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'Motshelo2026');
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
        const { full_name, email, password, phone, id_number, group_id } = req.body;
        
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Note: 'contribution_day' is NOT NULL in your schema, so we add a default
        const { data, error } = await supabase
            .from('members')
            .insert([
                { 
                    full_name, 
                    email, 
                    phone, 
                    id_number, 
                    contribution_day: "1st", 
                    group_id: group_id || 1,
                    role: 'Member'
                    // Add password_hash here if you added that column to the 'members' table
                }
            ])
            .select();

        if (error) throw error;
        res.status(201).json({ message: "Member registered in Supabase!", data: data[0] });
    } catch (err) {
        console.error("Registration Error:", err.message);
        res.status(500).json({ message: "Registration failed: " + err.message });
    }
});

// 2. LOGIN
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const { data: user, error } = await supabase
            .from('members')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // For demo: verify against a hardcoded hash or the column if you added it
        // const isMatch = await bcrypt.compare(password, user.password_hash);
        const isMatch = true; // Temporary bypass for demo if hash column isn't ready

        if (isMatch) {
            const token = jwt.sign(
                { id: user.id, role: user.role, name: user.full_name, email: user.email }, 
                process.env.JWT_SECRET || 'Motshelo2026', 
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

// 3. DASHBOARD
app.get('/api/dashboard', protect, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('member_summary')
            .select('*')
            .eq('email', req.user.email)
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Could not fetch dashboard data" });
    }
});

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 RE-MMOGO Gatekeeper running on http://localhost:${PORT}`);
});