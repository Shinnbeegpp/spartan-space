const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

async function testDbConnection() {
    try {
        const connection = await db.getConnection();
        console.log('✅ Connected to MySQL Database successfully!');
        connection.release();
    }catch (error) {
        console.error('❌ Database connection failed:', error.message);
    }
}


testDbConnection();

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: '✅ SpartanSpaces API Server is Running'});
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});