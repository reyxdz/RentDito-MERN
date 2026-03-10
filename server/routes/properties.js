const express = require('express');
const { body } = require('express-validator');
const {
  getAllProperties,
  createProperty,
  getProperty,
  updateProperty,
  deleteProperty,
  getPropertyStats
} = require('../controllers/propertyController');
const { protect, authorize, checkPropertyAccess } = require('../middleware/auth');
const Room = require('../models/Room');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all properties (filtered by user role)
router.get('/', getAllProperties);

// Create property (landlord only)
router.post('/', authorize('landlord'), [
  body('name').notEmpty().withMessage('Property name is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('city').notEmpty().withMessage('City is required')
], createProperty);

// Get specific property
router.get('/:id', getProperty);

// Get rooms for a property
router.get('/:id/rooms', async (req, res) => {
  try {
    const { id } = req.params;
    const rooms = await Room.find({ propertyId: id })
      .populate('currentTenant', 'fullName email phone')
      .lean();
    res.json({
      success: true,
      data: rooms
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get property stats
router.get('/:id/stats', getPropertyStats);

// Update property (landlord/admin only)
router.put('/:id', authorize('landlord', 'landlord-admin'), checkPropertyAccess, updateProperty);

// Delete property (landlord only)
router.delete('/:id', authorize('landlord'), deleteProperty);

module.exports = router;
