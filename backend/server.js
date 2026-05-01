const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json()); 

// Basic Route for testing
app.get('/', (req, res) => {
    res.send("Re-Mmogo Backend API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});