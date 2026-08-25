const db = require('../config/db');

// 1. Fetch all landlords waiting for approval
const getUnverifiedLandlords = async (req, res) => {
    try {
        // FIXED: Used ? placeholder instead of double quotes
        const [landlords] = await db.query(
            'SELECT id, email, role, is_verified FROM Users WHERE role = ? AND is_verified = FALSE',
            ['landlord']
        );
        return res.status(200).json(landlords);
    } catch (error) {
        console.error('Error fetching landlords:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// 2. Approve a landlord by changing is_verified to TRUE
const approveLandlord = async (req, res) => {
    try {
        const { id } = req.params; 

        // FIXED: Used ? placeholder for the role here too
        const [result] = await db.query(
            'UPDATE Users SET is_verified = TRUE WHERE id = ? AND role = ?',
            [id, 'landlord']
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

module.exports = {
    getUnverifiedLandlords,
    approveLandlord
};