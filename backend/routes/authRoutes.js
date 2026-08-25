const express = require('express');
const router = express.Router();
const { registerLandlord } = require('../controllers/authController');

// POST /api/auth/register-landlord
router.post('/register-landlord', registerLandlord);
module.exports = router;