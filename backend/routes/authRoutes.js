const express = require('express');
const router = express.Router();
const { registerLandlord, loginLandlord, loginStudent } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public Routes
router.post('/register-landlord', registerLandlord);
router.post('/login-landlord', loginLandlord);
router.post('/google-login-student', loginStudent);

// Protected Route
router.get('/me', protect, (req, res) => {
    res.status(200).json({ 
        message: 'You successfully bypassed the bouncer!', 
        userData: req.user 
    });
});

module.exports = router;