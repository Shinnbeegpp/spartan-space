const bcrypt = require('bcrypt');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * 3. Log in or Register a Student via Google OAuth
 */
const loginStudent = async (req, res) => {
    try {
        const { credential } = req.body; // This is the Google ID token sent from the React frontend

        if (!credential) {
            return res.status(400).json({ error: 'Google token is required' });
        }

        // 1. Verify the token mathematically with Google's servers
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const email = payload.email;

        // 2. Domain Restriction: Reject non-student emails
        // This ensures only legitimate Batangas State University students can enter
        if (!email.endsWith('@g.batstate-u.edu.ph') && !email.endsWith('@sr.batstate-u.edu.ph')) {
            return res.status(403).json({ error: 'Access denied. Must use a valid BatStateU student email.' });
        }

        // 3. Check if student already exists in our database
        let [users] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
        let user;

        if (users.length === 0) {
            // New student! Create their account.
            // Since they log in with Google, they don't have a password. 
            // We generate a random dummy password to satisfy our database's "NOT NULL" requirement.
            const dummyPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
            
            const [result] = await db.query(
                'INSERT INTO Users (email, password, role, is_verified) VALUES (?, ?, ?, ?)',
                [email, dummyPassword, 'student', true] // Students are auto-verified
            );
            
            user = { id: result.insertId, email, role: 'student', is_verified: true };
        } else {
            user = users[0];
            // Security check: Make sure a landlord isn't trying to log in as a student
            if (user.role !== 'student') {
                 return res.status(403).json({ error: 'This email is registered as a landlord or admin.' });
            }
        }

        // 4. Generate the SpartanSpaces JWT (Digital ID Badge)
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            message: 'Student login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                is_verified: user.is_verified
            }
        });

    } catch (error) {
        console.error('Error verifying Google token:', error);
        return res.status(401).json({ error: 'Invalid or expired Google token' });
    }
};


const registerLandlord = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const [existingUsers] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);


        const [result] = await db.query(
            'INSERT INTO Users (email, password, role, is_verified) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, 'landlord', false]
        );

        return res.status(201).json({
            message: 'Landlord registered successfully',
            user: {
                id: result.insertId,
                email,
                role: 'landlord',
                is_verified: false
            }
        });
    } catch (error) {
        console.error('Error in registerLandlord:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


const loginLandlord = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const [users] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } 
        );

        return res.status(200).json({
            message: 'Login successful',
            token, 
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                is_verified: user.is_verified
            }
        });
    } catch (error) {
        console.error('Error in loginLandlord:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};



const getUnverifiedLandlords = async (req, res) => {
    try {
        const [landlords] = await db.query(
            'SELECT id, email, role, is_verified FROM Users WHERE role = "landlord" AND is_verified = FALSE'
        );
        return res.status(200).json(landlords);
    } catch (error) {
        console.error('Error fetching landlords:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


const approveLandlord = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            'UPDATE Users SET is_verified = TRUE WHERE id = ? AND role = "landlord"',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Landlord not found or already verified' });
        }

        return res.status(200).json({ message: 'Landlord successfully verified!' });
    } catch (error) {
        console.error('Error verifying landlord:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


// Export BOTH functions so the routes file can use them
module.exports = {
    registerLandlord,
    loginLandlord,
    loginStudent
};