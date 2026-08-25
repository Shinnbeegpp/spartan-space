const express = require('express');
const router = express.Router();
const { getUnverifiedLandlords, approveLandlord } = require('../controllers/adminController');

// Import BOTH bouncers
const { protect, adminOnly } = require('../middleware/authMiddleware'); 

// Apply bouncers to ALL admin routes
router.use(protect, adminOnly);

// GET /api/admin/unverified-landlords
router.get('/unverified-landlords', getUnverifiedLandlords);

// PUT /api/admin/approve-landlord/:id
router.put('/approve-landlord/:id', approveLandlord);

module.exports = router;