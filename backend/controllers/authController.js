const bcrypt = require('bcrypt');
const db = require('../config/db');

/**
 * Register a new landlord
 */
const registerLandlord = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check if user already exists
        const [existingUsers] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert new landlord user into database
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

module.exports = {
    registerLandlord,
};
